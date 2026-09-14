import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { occasions } from "@/lib/occasions";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
        <div>
          <h1 className="text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            Beautiful Moments
            <br />
            Start with <span className="text-gold-600">Balloora</span>
          </h1>
          <p className="text-gold-600 mt-6 text-lg font-medium">
            Balloons • Flowers • Event Decor • Unforgettable Memories
          </p>
          <Link
            href="/shop"
            className="bg-gold-500 hover:bg-gold-600 mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-medium text-white shadow-sm transition-colors"
          >
            Shop Our Collections
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/hero.jpg"
            alt="Elegant white and gold balloon arch with floral arrangements"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ------------------------------------------------------- Occasions band */}
      <section className="bg-cream-100 border-y" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-6 lg:px-10">
          {occasions.map((o) => (
            <Link
              key={o.slug}
              href={`/shop?occasion=${o.slug}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <span className="bg-gold-100 text-gold-600 group-hover:bg-gold-200 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                {o.icon}
              </span>
              <span className="text-sm font-medium">{o.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- Featured */}
      <section id="packages" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-gold-600 text-sm font-medium tracking-wide uppercase">Curated for you</p>
            <h2 className="mt-1 text-3xl font-bold sm:text-4xl">Featured Collections</h2>
          </div>
          <Link href="/shop" className="text-gold-600 hidden text-sm font-medium hover:underline sm:block">
            View all →
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p
            className="rounded-xl border border-dashed p-8 text-center text-sm"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Collections appear here once your catalog is connected. Run the migrations in{" "}
            <code>supabase/migrations</code> and <code>supabase/seed.sql</code>, then set your
            Supabase environment variables.
          </p>
        )}
      </section>

      {/* ---------------------------------------------------------------- About */}
      <section id="about" className="bg-cream-50 border-y" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-gold-600 text-sm font-medium tracking-wide uppercase">Our story</p>
            <h2 className="mt-1 text-3xl font-bold sm:text-4xl">Designed to Delight</h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
              From intimate gatherings to grand celebrations, Balloora crafts balloon installations,
              floral styling, and full event decor tailored to your vision. Every arch, every bloom,
              every detail is designed to make your moment unforgettable.
            </p>
            <Link
              href="/#contact"
              className="text-gold-600 border-gold-300 hover:bg-gold-50 mt-6 inline-block rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
            >
              Get a Quote
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { stat: "500+", label: "Events Styled" },
              { stat: "6", label: "Occasion Types" },
              { stat: "5★", label: "Client Rating" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border bg-white p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-gold-600 font-serif text-3xl font-bold">{s.stat}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
