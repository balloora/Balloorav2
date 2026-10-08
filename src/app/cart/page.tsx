"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

const MAX_QUANTITY = 99;

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

const icons = {
  bag: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
  trash: "M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  lock: "M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5z",
};

export default function CartPage() {
  const { items, hydrated, itemCount, subtotalCents, setQuantity, removeItem } = useCart();
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
      // The server may answer with an empty body on a hard crash; don't let
      // that surface as a cryptic "Unexpected end of JSON input".
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "We couldn't start checkout. Please try again in a moment.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  // Saved cart hasn't loaded yet — avoid flashing the empty state.
  if (!hydrated) {
    return <div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-10" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <span className="bg-gold-50 text-gold-600 flex h-20 w-20 items-center justify-center rounded-full">
          <Icon d={icons.bag} size={34} />
        </span>
        <h1 className="mt-6 text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Balloons, flowers and décor for every occasion are waiting for you.
        </p>
        <Link
          href="/products"
          className="bg-gold-500 hover:bg-gold-600 mt-8 inline-flex h-12 items-center rounded-lg px-6 font-medium text-white transition-colors"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  const currency = items[0]?.currency ?? "cad";

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Your cart</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <Link href="/products" className="text-gold-600 shrink-0 text-sm font-medium hover:underline">
          ← Continue shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Line items */}
        <ul className="divide-y self-start border-y lg:col-span-7" style={{ borderColor: "var(--border)" }}>
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-6 sm:gap-6" style={{ borderColor: "var(--border)" }}>
              <Link
                href={`/products/${item.productId}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28"
                style={{ background: "var(--color-cream-100)" }}
              >
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} fill sizes="112px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl" aria-hidden>
                    🎈
                  </div>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="hover:text-gold-600 line-clamp-2 font-medium transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      {formatPrice(item.priceCents, item.currency)} each
                    </p>
                  </div>
                  <p className="shrink-0 font-medium">
                    {formatPrice(item.priceCents * item.quantity, item.currency)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div
                    className="flex h-10 items-center overflow-hidden rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.title}`}
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="hover:bg-cream-100 flex h-full w-10 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= MAX_QUANTITY}
                      className="hover:bg-cream-100 flex h-full w-10 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    style={{ color: "var(--muted)" }}
                  >
                    <Icon d={icons.trash} size={16} />
                    <span className="hidden sm:inline">Remove</span>
                    <span className="sr-only sm:hidden">Remove {item.title}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Order summary */}
        <aside className="lg:col-span-5">
          <div
            className="rounded-3xl border p-6 sm:p-8 lg:sticky lg:top-24"
            style={{ borderColor: "var(--border)", background: "var(--color-cream-50)" }}
          >
            <h2 className="text-xl font-semibold">Order summary</h2>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt style={{ color: "var(--muted)" }}>
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </dt>
                <dd className="font-medium">{formatPrice(subtotalCents, currency)}</dd>
              </div>
              <div
                className="flex items-baseline justify-between border-t pt-4 text-base"
                style={{ borderColor: "var(--border)" }}
              >
                <dt className="font-medium">Total</dt>
                <dd className="text-2xl font-semibold">{formatPrice(subtotalCents, currency)}</dd>
              </div>
            </dl>

            {error && (
              <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button onClick={handleCheckout} disabled={loading} size="lg" className="mt-6 w-full">
              {loading ? "Redirecting to secure checkout…" : "Checkout"}
            </Button>

            <p
              className="mt-4 flex items-center justify-center gap-1.5 text-xs"
              style={{ color: "var(--muted)" }}
            >
              <Icon d={icons.lock} size={14} />
              Secure payment powered by Stripe
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
