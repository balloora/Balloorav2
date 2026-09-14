"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotalCents, setQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Find something you love in the marketplace.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  const currency = items[0]?.currency ?? "usd";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Your cart</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center gap-4 rounded-xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg"
              style={{ background: "var(--color-cream-100)" }}
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl" aria-hidden>
                  🎈
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.title}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {formatPrice(item.priceCents, item.currency)}
              </p>
            </div>

            <label className="sr-only" htmlFor={`qty-${item.productId}`}>
              Quantity for {item.title}
            </label>
            <input
              id={`qty-${item.productId}`}
              type="number"
              min={1}
              max={99}
              value={item.quantity}
              onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
              className="h-9 w-16 rounded-lg border px-2 text-center"
              style={{ borderColor: "var(--border)", background: "var(--background)" }}
            />

            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div
        className="mt-6 flex items-center justify-between rounded-xl border p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-lg font-medium">Subtotal</span>
        <span className="text-lg font-bold">{formatPrice(subtotalCents, currency)}</span>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <Button onClick={handleCheckout} disabled={loading} size="lg" className="mt-4 w-full">
        {loading ? "Redirecting to Stripe…" : "Checkout"}
      </Button>
      <p className="mt-2 text-center text-xs" style={{ color: "var(--muted)" }}>
        Payments are processed securely by Stripe.
      </p>
    </div>
  );
}
