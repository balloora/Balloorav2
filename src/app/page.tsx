import { ProductCard } from "@/components/product-card";
import { createClient } from "@/lib/supabase/server";

// Revalidate the catalog periodically; individual product pages stay fresh too.
export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(48);

  return (
    <div className="space-y-8">
      <section
        className="rounded-2xl border p-8 sm:p-12"
        style={{ borderColor: "var(--border)", background: "var(--color-brand-50)" }}
      >
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: "var(--color-brand-700)" }}
        >
          Welcome to Balloora
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: "var(--color-brand-600)" }}>
          A marketplace for independent sellers. Browse the latest listings and check out securely
          with Stripe.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Latest listings</h2>

        {error && (
          <p
            className="rounded-lg border p-4 text-sm"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Couldn&apos;t load products. Make sure your Supabase schema is applied and environment
            variables are set.
          </p>
        )}

        {!error && (!products || products.length === 0) && (
          <p
            className="rounded-lg border p-4 text-sm"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            No products yet. Run the migrations in <code>supabase/migrations</code> and{" "}
            <code>supabase/seed.sql</code> to populate the catalog.
          </p>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
