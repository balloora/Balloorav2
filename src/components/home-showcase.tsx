import Image from "next/image";
import Link from "next/link";

import { featuredDesigns } from "@/lib/designs";
import { isSupabaseConfigured } from "@/lib/env";
import { quoteMailto } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

type ShowcaseItem = { key: string; href: string; image: string; title: string; meta: string };

/**
 * Two auto-scrolling image columns moving in opposite directions. Each column
 * renders its items twice so the -50% translate loops seamlessly.
 */
function ScrollingColumns({ items }: { items: ShowcaseItem[] }) {
  // Pad short lists so each column is taller than the viewport it scrolls in.
  let pool = items;
  while (pool.length > 0 && pool.length < 8) pool = [...pool, ...items];
  const columns = [pool.filter((_, i) => i % 2 === 0), pool.filter((_, i) => i % 2 === 1)];

  return (
    <div className="showcase showcase-mask relative grid h-[480px] grid-cols-2 gap-4 overflow-hidden sm:h-[560px]">
      {columns.map((col, c) => (
        <div
          key={c}
          className={`showcase-col ${c === 1 ? "showcase-col-reverse" : ""}`}
          style={{ ["--showcase-duration" as string]: `${col.length * 7}s` }}
        >
          {[...col, ...col].map((item, i) => (
            <Link
              key={`${item.key}-${i}`}
              href={item.href}
              aria-hidden={i >= col.length}
              tabIndex={i >= col.length ? -1 : undefined}
              className="group/card relative mb-4 block aspect-[4/5] overflow-hidden rounded-2xl shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 45vw, 280px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="line-clamp-1 font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs text-white/80">{item.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

function CheckList({ points }: { points: string[] }) {
  return (
    <ul className="mt-7 space-y-3">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-3 text-sm">
          <span className="bg-gold-50 text-gold-600 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m5 12 5 5 9-10" />
            </svg>
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}

async function loadProducts(): Promise<ShowcaseItem[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, title, price_cents, currency, image_url")
    .eq("status", "active")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(12);
  return (data ?? []).map((p) => ({
    key: p.id,
    href: `/products/${p.id}`,
    image: p.image_url as string,
    title: p.title,
    meta: formatPrice(p.price_cents, p.currency),
  }));
}

const serviceItems: ShowcaseItem[] = featuredDesigns.map((d) => ({
  key: d.slug,
  href: `/services#${d.slug}`,
  image: d.image,
  title: d.title,
  meta: d.price,
}));

export async function HomeShowcase() {
  const products = await loadProducts();

  return (
    <section className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:space-y-32 lg:px-10 lg:py-28">
      {/* Services: text left, showcase right */}
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Services</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight font-semibold sm:text-5xl">
            Full event styling, designed with you
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            From balloon arches and backdrops to ceiling installations and corporate events, we design
            décor around your space, your colours and your guest list.
          </p>
          <CheckList
            points={[
              "Tailored to your theme, colours and venue",
              "Balloons, florals and decor from one team",
              "A complimentary quote, with no pressure",
            ]}
          />
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/services"
              className="bg-gold-500 hover:bg-gold-600 group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-medium text-white transition-colors"
            >
              Explore services
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <a
              href={quoteMailto()}
              className="hover:bg-cream-100 inline-flex items-center justify-center rounded-full border px-8 py-3.5 font-medium transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              Get a quote
            </a>
          </div>
        </div>
        <ScrollingColumns items={serviceItems} />
      </div>

      {/* Products: showcase left, text right */}
      {products.length > 0 && (
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:order-2">
            <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Shop</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-semibold sm:text-5xl">
              Ready-to-celebrate décor
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              Balloons, blooms and finishing touches you can order online in a few clicks. Pick your
              favourites, check out securely, and you&apos;re ready for the party.
            </p>
            <CheckList
              points={[
                "Designs for every occasion",
                "Secure checkout powered by Stripe",
                "Want different colours or sizing? Just ask",
              ]}
            />
            <Link
              href="/products"
              className="bg-gold-500 hover:bg-gold-600 group mt-9 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-medium text-white transition-colors"
            >
              Shop products
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
          <div className="lg:order-1">
            <ScrollingColumns items={products} />
          </div>
        </div>
      )}
    </section>
  );
}
