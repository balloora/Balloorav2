import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { isSupabaseConfigured } from "@/lib/env";
import { occasions } from "@/lib/occasions";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse balloons, flowers, and event decor for every occasion.",
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ occasion?: string }>;
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const { occasion } = await searchParams;
  const activeOccasion = occasions.find((o) => o.slug === occasion);

  // Skip the network call entirely when Supabase isn't configured (placeholder
  // env), otherwise every navigation blocks on a request that can only time out.
  let products: Product[] | null = null;
  let error: { message: string } | null = null;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(60);

    // Filter by occasion when one is selected (products.category stores the label).
    if (activeOccasion) {
      query = query.eq("category", activeOccasion.name);
    }

    ({ data: products, error } = await query);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
      <header className="mb-8">
        <p className="text-gold-600 text-sm font-medium tracking-wide uppercase">Balloora Collections</p>
        <h1 className="mt-1 text-4xl font-bold">{activeOccasion ? activeOccasion.name : "Explore"}</h1>
      </header>

      {/* Occasion filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/explore"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeOccasion ? "hover:bg-cream-100" : "bg-gold-500 border-gold-500 text-white"
          }`}
          style={activeOccasion ? { borderColor: "var(--border)" } : undefined}
        >
          All
        </Link>
        {occasions.map((o) => {
          const active = o.slug === occasion;
          return (
            <Link
              key={o.slug}
              href={`/explore?occasion=${o.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active ? "bg-gold-500 border-gold-500 text-white" : "hover:bg-cream-100"
              }`}
              style={active ? undefined : { borderColor: "var(--border)" }}
            >
              {o.name}
            </Link>
          );
        })}
      </div>

      {error && (
        <p
          className="rounded-xl border border-dashed p-8 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Couldn&apos;t load products. Connect Supabase and run the migrations to populate the catalog.
        </p>
      )}

      {!error && (!products || products.length === 0) && (
        <p
          className="rounded-xl border border-dashed p-8 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          No products{activeOccasion ? ` for ${activeOccasion.name}` : ""} yet.
        </p>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
