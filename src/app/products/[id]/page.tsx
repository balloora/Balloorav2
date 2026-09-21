import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/add-to-cart";
import { ProductGallery } from "@/components/product-gallery";
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

  const galleryImages = product.images?.length
    ? product.images
    : product.image_url
      ? [product.image_url]
      : [];

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <ProductGallery images={galleryImages} alt={product.title} />

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
