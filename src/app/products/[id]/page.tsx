import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/add-to-cart";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description ?? undefined,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--border)", background: "var(--color-cream-100)" }}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl" aria-hidden>
            🎈
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {product.category && (
          <span className="text-sm tracking-wide uppercase" style={{ color: "var(--muted)" }}>
            {product.category}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
        <p className="text-2xl font-semibold">
          {formatPrice(product.price_cents, product.currency)}
        </p>

        {product.description && (
          <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
            {product.description}
          </p>
        )}

        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
        </p>

        <div className="mt-2">
          <AddToCart product={product} />
        </div>
      </div>
    </article>
  );
}
