import type { Metadata } from "next";
import Image from "next/image";

import { ServiceCard } from "@/components/service-card";
import { featuredDesigns } from "@/lib/designs";
import { isSupabaseConfigured } from "@/lib/env";
import { CONTACT_PHONE, QUOTE_EMAIL, quoteMailto } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Balloon installations, floral styling and full event decor, designed around your celebration. Request a complimentary quote.",
};

export const revalidate = 60;

// Bento layout for the signature designs (6-column grid on large screens).
// Rows: 4+2 · 2+2+2 · 3+3 · 2+2+2.
const spans = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

const steps = [
  {
    title: "Tell us about your event",
    body: "Your date, guest count, occasion and the colours or theme you have in mind. A rough idea is plenty.",
  },
  {
    title: "We design your concept",
    body: "We suggest a design that fits your space and budget, and send you a complimentary quote.",
  },
  {
    title: "We bring it to life",
    body: "Your balloons, blooms and decor are crafted and styled for the day, down to the last detail.",
  },
  {
    title: "You celebrate",
    body: "Your guests walk in, the photos start, and you get to enjoy the moment.",
  },
];

const heroImages = ["/design-wedding-backdrop.jpg", "/design-classic-arch.jpg", "/design-ceiling.jpg"] as const;

function ArrowIcon() {
  return (
    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
      →
    </span>
  );
}

export default async function ServicesPage() {
  // Venues and event packages managed in the admin panel (shown only if any exist).
  let listings: Service[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(12);
    listings = data ?? [];
  }

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="bg-cream-50 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Our services</p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] font-semibold sm:text-5xl lg:text-6xl">
              Let&apos;s design your celebration, together.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              Balloon installations, floral styling and full event decor, designed around your
              colours, your space and your story. Tell us what you&apos;re celebrating and we&apos;ll
              take it from there.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={quoteMailto()}
                className="bg-gold-500 hover:bg-gold-600 group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-medium text-white shadow-sm transition-colors"
              >
                Start your free quote
                <ArrowIcon />
              </a>
              <a
                href={`tel:${CONTACT_PHONE.tel}`}
                className="hover:bg-cream-100 inline-flex items-center justify-center rounded-full border px-8 py-3.5 font-medium transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                Call {CONTACT_PHONE.display}
              </a>
            </div>
          </div>

          {/* Collage */}
          <div className="relative mx-auto grid w-full max-w-lg grid-cols-5 grid-rows-6 gap-3 sm:gap-4 lg:max-w-none" style={{ aspectRatio: "5 / 5" }}>
            <div className="relative col-span-3 row-span-6 overflow-hidden rounded-3xl shadow-lg">
              <Image src={heroImages[0]} alt="Ivory floral and balloon wedding backdrop" fill priority sizes="(max-width: 1024px) 60vw, 380px" className="object-cover" />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-lg">
              <Image src={heroImages[1]} alt="Gold and cream balloon arch" fill sizes="(max-width: 1024px) 40vw, 250px" className="object-cover" />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-3xl shadow-lg">
              <Image src={heroImages[2]} alt="Balloon ceiling installation" fill sizes="(max-width: 1024px) 40vw, 250px" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Signature designs */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Signature designs</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              A starting point for your vision
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Every design is made to order. Colours, size and details are tailored to you, so prices
            shown are where each design starts. Ask about any of them and we&apos;ll shape it to your
            event.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[360px] lg:grid-cols-6 lg:gap-5">
          {featuredDesigns.map((d, i) => (
            <article
              key={d.slug}
              id={d.slug}
              className={`group target:ring-gold-400 relative isolate flex min-h-[380px] scroll-mt-28 flex-col justify-end overflow-hidden rounded-3xl target:ring-4 lg:min-h-0 ${spans[i] ?? "lg:col-span-2"}`}
            >
              <Image
                src={d.image}
                alt={d.alt}
                fill
                sizes={i === 0 ? "(max-width: 1024px) 100vw, 800px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"}
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/0" />

              <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
                {d.price}
              </span>

              <div className="p-6 text-white">
                <h3 className="font-serif text-2xl font-semibold">{d.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">{d.description}</p>
                <a
                  href={quoteMailto(d.title)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white hover:text-ink"
                >
                  Ask about this
                  <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- How it works */}
      <section className="bg-cream-50 border-y" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">How it works</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              From first message to final balloon
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
              You don&apos;t need a finished plan to reach out. Bring the occasion and we&apos;ll help
              with the rest.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border)" }}>
                <span className="text-gold-500 font-serif text-4xl font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------- Venues & packages (admin-managed) */}
      {listings.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Venues &amp; packages</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">More ways we can help</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="relative isolate overflow-hidden rounded-[2rem] shadow-sm">
          <Image src="/design-gender-reveal.jpg" alt="" fill sizes="(max-width: 1024px) 100vw, 1200px" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-black/60" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          <div className="px-6 py-16 sm:px-14 lg:px-20 lg:py-24">
            <div className="max-w-xl">
              <p className="text-gold-200 text-xs font-medium tracking-[0.25em] uppercase">
                Let&apos;s celebrate together
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.1] font-semibold text-white sm:text-5xl">
                Have a date in mind?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
                Send us a few details and we&apos;ll come back with ideas and a complimentary quote.
                No commitment, just a conversation about your event.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  href={quoteMailto()}
                  className="bg-gold-500 hover:bg-gold-400 group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white transition-colors"
                >
                  Email {QUOTE_EMAIL}
                  <ArrowIcon />
                </a>
                <a href={`tel:${CONTACT_PHONE.tel}`} className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                  or call {CONTACT_PHONE.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
