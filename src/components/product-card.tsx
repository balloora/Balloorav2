import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/database.types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group focus-visible:ring-gold-400 flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ background: "var(--color-cream-100)" }}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl" aria-hidden>
            🎈
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category && (
          <span className="text-xs tracking-wide uppercase" style={{ color: "var(--muted)" }}>
            {product.category}
          </span>
        )}
        <h3 className="line-clamp-1 font-medium">{product.title}</h3>
        <p className="mt-auto pt-2 font-semibold">
          {formatPrice(product.price_cents, product.currency)}
        </p>
      </div>
    </Link>
  );
}
