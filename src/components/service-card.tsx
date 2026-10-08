import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import type { Service } from "@/types/database.types";

export function ServiceCard({ service }: { service: Service }) {
  const details = [
    service.location,
    service.capacity ? `Up to ${service.capacity} guests` : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group focus-visible:ring-gold-400 flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: "var(--color-cream-100)" }}>
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl" aria-hidden>
            ✨
          </div>
        )}
        <span className="text-gold-700 absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur">
          {service.service_type}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        {service.summary && (
          <p className="line-clamp-2 text-sm" style={{ color: "var(--muted)" }}>
            {service.summary}
          </p>
        )}
        {details.length > 0 && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {details.join(" · ")}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="font-semibold">
            {service.price_from_cents != null
              ? `From ${formatPrice(service.price_from_cents, service.currency)}`
              : "Price on request"}
          </p>
          <span className="text-gold-600 text-sm font-medium transition-transform group-hover:translate-x-0.5">
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
