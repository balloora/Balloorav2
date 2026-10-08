import Image from "next/image";
import Link from "next/link";

import { AboutFlow } from "@/components/about-flow";
import { HomeShowcase } from "@/components/home-showcase";

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
              href="/products"
              className="bg-gold-500 hover:bg-gold-400 group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-medium text-white shadow-lg transition-colors"
            >
              Explore Our Products
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Explore Our Services
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Scroll cue — pinned to the bottom of the hero. */}
        <div className="relative z-10 flex justify-center pb-8">
          <a
            href="#about"
            aria-label="Scroll down"
            className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/90 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------------------------------------------------------------- About */}
      <AboutFlow />

      {/* ---------------------------------------- Products & services showcase */}
      <HomeShowcase />

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
                  href="mailto:info@balloora.ca"
                  className="bg-gold-500 hover:bg-gold-400 group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white transition-colors"
                >
                  Contact the Team
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <a
                  href="tel:+14372611195"
                  className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  or call +1 (437) 261-1195
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
