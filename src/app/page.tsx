import Image from "next/image";
import Link from "next/link";

import { FeaturedDesigns } from "@/components/featured-designs";
import { occasions } from "@/lib/occasions";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      {/* Full-screen hero; the header floats over it (see Navbar overlay mode). */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
        {/* Dark textured background */}
        <Image
          src="/hero-arch.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/70" />
        {/* Fine grain for texture */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pt-28 pb-10 text-center sm:px-6">
          <p className="text-gold-200 text-[0.7rem] font-medium tracking-[0.35em] uppercase sm:text-sm">
            Luxury Balloon Décor &amp; Event Styling
          </p>

          <h1 className="mt-5 flex flex-col items-center">
            <span className="font-script text-6xl leading-none text-white drop-shadow-lg sm:text-8xl lg:text-9xl">
              Balloora
            </span>
            <span className="mt-3 text-[0.65rem] font-medium tracking-[0.5em] text-white/70 uppercase sm:text-xs">
              Events
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Balloons • Flowers • Event Decor • Unforgettable Memories
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/explore"
              className="bg-gold-500 hover:bg-gold-400 group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-medium text-white shadow-lg transition-colors"
            >
              Explore Our Collections
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-full border border-white/40 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Occasions band — pinned to the bottom of the hero. A swipe carousel on
            mobile; a centered wrapped row on larger screens. */}
        <div className="relative z-10">
          <div className="hide-scrollbar mx-auto flex max-w-7xl snap-x snap-proximity scroll-pl-4 gap-3 overflow-x-auto px-4 pb-8 pt-2 sm:scroll-pl-6 sm:px-6 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-10">
            {occasions.map((o) => (
              <Link
                key={o.slug}
                href={`/explore?occasion=${o.slug}`}
                className="group inline-flex shrink-0 snap-start items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] py-2.5 pr-5 pl-2.5 text-sm font-medium text-white/90 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:text-white"
              >
                <span className="text-gold-200 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  {o.icon}
                </span>
                <span className="whitespace-nowrap">{o.name}</span>
              </Link>
            ))}
          </div>
        </div>
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
              { stat: "4.9★", label: "Client Rating" },
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

      {/* -------------------------------------------------- Featured designs */}
      <FeaturedDesigns />

      {/* ------------------------------------------------------------ Contact CTA */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div
          className="relative isolate overflow-hidden rounded-[2rem] border shadow-sm"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Background image + refined overlays */}
          <Image
            src="/design-wedding-backdrop.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

          <div className="relative px-6 py-20 sm:px-14 lg:px-20 lg:py-28">
            <div className="max-w-xl">
              <p className="text-gold-200 text-xs font-medium tracking-[0.25em] uppercase">
                Let&apos;s celebrate together
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.1] font-semibold text-white sm:text-5xl">
                Planning something special?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
                Share your vision and our team will craft a complimentary estimate — from intimate
                gatherings to grand celebrations across Ontario.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href="mailto:hello@balloora.events"
                  className="bg-gold-500 hover:bg-gold-400 group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white transition-colors"
                >
                  Contact the Team
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <a
                  href="tel:+15550102030"
                  className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  or call +1 (555) 010-2030
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
