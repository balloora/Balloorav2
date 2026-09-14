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

  const soldOut = product.inventory <= 0;

  function handleAdd(goToCart: boolean) {
    addItem(
      {
        productId: product.id,
        title: product.title,
        priceCents: product.price_cents,
        currency: product.currency,
        imageUrl: product.image_url,
      },
      1,
    );
    if (goToCart) {
      router.push("/cart");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => handleAdd(false)} disabled={soldOut} size="lg">
        {soldOut ? "Sold out" : added ? "Added ✓" : "Add to cart"}
      </Button>
      <Button onClick={() => handleAdd(true)} disabled={soldOut} variant="secondary" size="lg">
        Buy now
      </Button>
    </div>
  );
}
