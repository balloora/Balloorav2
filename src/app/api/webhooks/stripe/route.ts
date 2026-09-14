import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { serverEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe requires the raw, unparsed request body to verify the signature.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, serverEnv().STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature.";
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id ?? session.client_reference_id;
        if (!orderId) break;

        // Idempotent: mark the order paid and record payment identifiers.
        await admin
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
          })
          .eq("id", orderId);

        // Decrement inventory for each purchased item.
        const { data: orderItems } = await admin
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", orderId);

        for (const item of orderItems ?? []) {
          if (!item.product_id) continue;
          await admin.rpc("decrement_inventory", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id ?? session.client_reference_id;
        if (orderId) {
          await admin.from("orders").update({ status: "cancelled" }).eq("id", orderId);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const paymentIntentId =
          typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (paymentIntentId) {
          await admin
            .from("orders")
            .update({ status: "refunded" })
            .eq("stripe_payment_intent_id", paymentIntentId);
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    // Return 500 so Stripe retries delivery.
    const message = err instanceof Error ? err.message : "Handler error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
