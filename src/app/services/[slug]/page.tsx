import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product-gallery";
import { ServiceCard } from "@/components/service-card";
import { QUOTE_EMAIL, quoteMailto, serviceTypes } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data;
}

async function getRelated(id: string, serviceType: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("status", "active")
    .eq("service_type", serviceType)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(3);
  return data ?? [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  const description = service.summary ?? service.description ?? undefined;
  return {
    title: service.title,
    description,
    openGraph: {
      title: service.title,
      description,
      images: service.image_url ? [service.image_url] : undefined,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const related = await getRelated(service.id, service.service_type);
  const type = serviceTypes.find((t) => t.name === service.service_type);

  const galleryImages = service.images?.length
    ? service.images
    : service.image_url
      ? [service.image_url]
      : [];

  const facts = [
    { label: "Location", value: service.location },
    { label: "Capacity", value: service.capacity ? `Up to ${service.capacity} guests` : null },
    {
      label: "Pricing",
      value:
        service.price_from_cents != null
          ? `From ${formatPrice(service.price_from_cents, service.currency)}`
          : "Quoted per event",
    },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

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
            <Link href="/services" className="hover:text-gold-600">
              Services
            </Link>
          </li>
          {type && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/services?type=${type.slug}`} className="hover:text-gold-600">
                  {type.plural}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>/</li>
          <li className="text-ink line-clamp-1 font-medium" aria-current="page">
            {service.title}
          </li>
        </ol>
      </nav>

      <article className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          {galleryImages.length > 0 ? (
            <ProductGallery images={galleryImages} alt={service.title} />
          ) : (
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-2xl text-6xl"
              style={{ background: "var(--color-cream-100)" }}
              aria-hidden
            >
              ✨
            </div>
          )}
        </div>

        <div className="flex flex-col lg:sticky lg:top-24 lg:col-span-5 lg:self-start lg:pt-2">
          <span className="bg-gold-50 text-gold-700 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase">
            {service.service_type}
          </span>

          <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            {service.title}
          </h1>

          {service.summary && (
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              {service.summary}
            </p>
          )}

          {facts.length > 0 && (
            <dl
              className="mt-6 grid gap-4 border-y py-5 sm:grid-cols-3"
              style={{ borderColor: "var(--border)" }}
            >
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs tracking-wide uppercase" style={{ color: "var(--muted)" }}>
                    {f.label}
                  </dt>
                  <dd className="mt-1 font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {service.description && (
            <p className="mt-6 leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
              {service.description}
            </p>
          )}

          <div
            className="mt-8 rounded-2xl border p-5 sm:p-6"
            style={{ borderColor: "var(--border)", background: "var(--color-cream-50)" }}
          >
            <p className="font-medium">Interested in this {service.service_type.toLowerCase()}?</p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Tell us your date and guest count and we&apos;ll get back to you with a complimentary
              quote.
            </p>
            <a
              href={quoteMailto(service.title)}
              className="bg-gold-500 hover:bg-gold-600 mt-5 flex h-12 w-full items-center justify-center rounded-lg font-medium text-white transition-colors"
            >
              Request a quote
            </a>
            <p className="mt-3 text-center text-xs" style={{ color: "var(--muted)" }}>
              or email {QUOTE_EMAIL} · call{" "}
              <a href="tel:+15550102030" className="hover:text-gold-600">
                +1 (555) 010-2030
              </a>
            </p>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20 border-t pt-12" style={{ borderColor: "var(--border)" }}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">More {type?.plural.toLowerCase() ?? "services"}</h2>
            <Link
              href={type ? `/services?type=${type.slug}` : "/services"}
              className="text-gold-600 shrink-0 text-sm font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
