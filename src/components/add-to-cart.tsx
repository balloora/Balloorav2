"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types/database.types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const soldOut = product.inventory <= 0;
  const maxQuantity = Math.max(1, product.inventory);

  function handleAdd(goToCart: boolean) {
    addItem(
      {
        productId: product.id,
        title: product.title,
        priceCents: product.price_cents,
        currency: product.currency,
        imageUrl: product.image_url,
      },
      quantity,
    );
    if (goToCart) {
      router.push("/cart");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  const stepperButton =
    "flex h-full w-11 items-center justify-center text-lg transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div
          className="flex h-12 shrink-0 items-center overflow-hidden rounded-lg border bg-white"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            className={stepperButton}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={soldOut || quantity <= 1}
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            className={stepperButton}
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={soldOut || quantity >= maxQuantity}
          >
            +
          </button>
        </div>

        <Button onClick={() => handleAdd(false)} disabled={soldOut} size="lg" className="flex-1">
          {soldOut ? "Sold out" : added ? "Added to cart ✓" : "Add to cart"}
        </Button>
      </div>

      <Button
        onClick={() => handleAdd(true)}
        disabled={soldOut}
        variant="secondary"
        size="lg"
        className="w-full bg-white"
      >
        Buy now
      </Button>
    </div>
  );
}
