import type { Metadata } from "next";
import Link from "next/link";

import { ServiceCard } from "@/components/service-card";
import { isSupabaseConfigured } from "@/lib/env";
import { quoteMailto, serviceTypes } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Services",
  description: "Venues, event packages and full-service styling from Balloora Events.",
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const activeType = serviceTypes.find((t) => t.slug === type);

  let services: Service[] | null = null;
  let error: { message: string } | null = null;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    let query = supabase
      .from("services")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(60);

    if (activeType) query = query.eq("service_type", activeType.name);

    ({ data: services, error } = await query);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
      <header className="mb-8 max-w-2xl">
        <p className="text-gold-600 text-sm font-medium tracking-wide uppercase">Balloora Services</p>
        <h1 className="mt-1 text-4xl font-bold">{activeType ? activeType.plural : "Services"}</h1>
        <p className="mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
          Need more than décor? Book a venue, choose an event package, or let us take care of the
          whole celebration. Every service is quoted for your date, guest count and vision.
        </p>
      </header>

      {/* Type filters */}
      <div className="hide-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <Link
          href="/services"
          className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeType ? "hover:bg-cream-100" : "bg-gold-500 border-gold-500 text-white"
          }`}
          style={activeType ? { borderColor: "var(--border)" } : undefined}
        >
          All
        </Link>
        {serviceTypes.map((t) => {
          const active = t.slug === activeType?.slug;
          return (
            <Link
              key={t.slug}
              href={`/services?type=${t.slug}`}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active ? "bg-gold-500 border-gold-500 text-white" : "hover:bg-cream-100"
              }`}
              style={active ? undefined : { borderColor: "var(--border)" }}
            >
              {t.plural}
            </Link>
          );
        })}
      </div>

      {error && (
        <p
          className="rounded-xl border border-dashed p-8 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Couldn&apos;t load services. Connect Supabase and run the migrations to populate them.
        </p>
      )}

      {!error && (!services || services.length === 0) && (
        <p
          className="rounded-xl border border-dashed p-8 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          No {activeType ? activeType.plural.toLowerCase() : "services"} listed yet. Tell us what you
          have in mind and we&apos;ll put something together.
        </p>
      )}

      {services && services.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}

      {/* Custom request CTA */}
      <section
        className="bg-cream-50 mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border p-8 sm:flex-row sm:items-center"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold">Don&apos;t see what you need?</h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Every celebration is different. Share your date, guest count and ideas, and we&apos;ll
            send you a complimentary quote.
          </p>
        </div>
        <a
          href={quoteMailto()}
          className="bg-gold-500 hover:bg-gold-600 shrink-0 rounded-full px-7 py-3.5 text-sm font-medium text-white transition-colors"
        >
          Request a quote
        </a>
      </section>
    </div>
  );
}
