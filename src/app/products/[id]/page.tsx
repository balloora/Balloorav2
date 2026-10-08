import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { getCategories } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

const LOW_STOCK_THRESHOLD = 5;

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

// Same-category products first; fall back to the newest others if there are none.
async function getRelated(id: string, category: string | null) {
  const supabase = await createClient();
  const base = () =>
    supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(4);

  if (category) {
    const { data } = await base().eq("category", category);
    if (data?.length) return data;
  }
  const { data } = await base();
  return data ?? [];
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

function StockBadge({ inventory }: { inventory: number }) {
  const [label, dot] =
    inventory <= 0
      ? ["Out of stock", "bg-neutral-400"]
      : inventory <= LOW_STOCK_THRESHOLD
        ? [`Only ${inventory} left`, "bg-amber-500"]
        : ["In stock", "bg-emerald-500"];
  return (
    <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  );
}

const assurances = [
  {
    title: "Secure checkout",
    body: "Payments processed safely by Stripe.",
    icon: <path d="M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5z M12 14v2" />,
  },
  {
    title: "Made for your moment",
    body: "Want different colours or sizing? Just ask.",
    icon: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" />,
  },
];

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelated(product.id, product.category);
  const occasion = (await getCategories()).find((c) => c.name === product.category);

  const galleryImages = product.images?.length
    ? product.images
    : product.image_url
      ? [product.image_url]
      : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-gold-600">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/products" className="hover:text-gold-600">
              Products
            </Link>
          </li>
          {occasion && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/products?occasion=${occasion.slug}`} className="hover:text-gold-600">
                  {occasion.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>/</li>
          <li className="text-ink line-clamp-1 font-medium" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <article className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ProductGallery images={galleryImages} alt={product.title} />
        </div>

        <div className="flex flex-col lg:sticky lg:top-24 lg:col-span-5 lg:self-start lg:pt-2">
          {product.category && (
            <Link
              href={occasion ? `/products?occasion=${occasion.slug}` : "/products"}
              className="bg-gold-50 text-gold-700 hover:bg-gold-100 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase transition-colors"
            >
              {product.category}
            </Link>
          )}

          <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            {product.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-3xl font-medium">{formatPrice(product.price_cents, product.currency)}</p>
            <StockBadge inventory={product.inventory} />
          </div>

          {product.description && (
            <p className="mt-6 leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
              {product.description}
            </p>
          )}

          <div
            className="mt-8 rounded-2xl border p-5 sm:p-6"
            style={{ borderColor: "var(--border)", background: "var(--color-cream-50)" }}
          >
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {assurances.map((a) => (
              <li key={a.title} className="flex gap-3">
                <span className="bg-gold-50 text-gold-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {a.icon}
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {a.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 border-t pt-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Planning something bigger?{" "}
            <Link href="/#contact" className="text-gold-600 font-medium hover:underline">
              Request a custom quote →
            </Link>
          </p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20 border-t pt-12" style={{ borderColor: "var(--border)" }}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">You may also like</h2>
            <Link
              href={occasion ? `/products?occasion=${occasion.slug}` : "/products"}
              className="text-gold-600 shrink-0 text-sm font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
