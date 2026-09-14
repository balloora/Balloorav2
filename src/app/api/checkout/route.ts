import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(99),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { items } = parsed.data;

  // The signed-in user is optional — guests can check out too.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // SECURITY: never trust prices from the client. Re-fetch authoritative
  // product data (price, availability) from the database using the admin
  // client so archived/draft rows are visible for validation.
  const admin = createAdminClient();
  const productIds = items.map((i) => i.productId);
  const { data: products, error } = await admin
    .from("products")
    .select("id, title, price_cents, currency, image_url, inventory, status")
    .in("id", productIds);

  if (error) {
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }

  const productsById = new Map(products?.map((p) => [p.id, p]));

  // Validate every line item against live data.
  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product || product.status !== "active") {
      return NextResponse.json(
        { error: `Product ${item.productId} is not available.` },
        { status: 409 },
      );
    }
    if (product.inventory < item.quantity) {
      return NextResponse.json(
        { error: `Not enough inventory for "${product.title}".` },
        { status: 409 },
      );
    }
  }

  const currency = products?.[0]?.currency ?? "usd";
  const totalCents = items.reduce((sum, item) => {
    const product = productsById.get(item.productId)!;
    return sum + product.price_cents * item.quantity;
  }, 0);

  const stripe = getStripe();

  // Record a pending order first so the webhook can reconcile it later.
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      buyer_id: user?.id ?? null,
      status: "pending",
      total_cents: totalCents,
      currency,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }

  const orderItems = items.map((item) => {
    const product = productsById.get(item.productId)!;
    return {
      order_id: order.id,
      product_id: product.id,
      title: product.title,
      unit_price_cents: product.price_cents,
      quantity: item.quantity,
    };
  });

  const { error: itemsError } = await admin.from("order_items").insert(orderItems);
  if (itemsError) {
    return NextResponse.json({ error: "Failed to create order items." }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Reuse the customer email if we know it, for nicer receipts.
      customer_email: user?.email ?? undefined,
      line_items: items.map((item) => {
        const product = productsById.get(item.productId)!;
        return {
          quantity: item.quantity,
          price_data: {
            currency: product.currency,
            unit_amount: product.price_cents,
            product_data: {
              name: product.title,
              images: product.image_url ? [product.image_url] : undefined,
            },
          },
        };
      }),
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/cart`,
      // Tie the Stripe session back to our order for webhook reconciliation.
      client_reference_id: order.id,
      metadata: { order_id: order.id },
      payment_intent_data: {
        metadata: { order_id: order.id },
      },
    });

    // Store the session id on the order.
    await admin
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Roll the pending order back to cancelled if Stripe rejected us.
    await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    const message = err instanceof Error ? err.message : "Stripe error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
