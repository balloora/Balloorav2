import Image from "next/image";
import Link from "next/link";

import { featuredDesigns } from "@/lib/designs";

// Duplicate the list so the marquee track can loop seamlessly (-50% translate).
const track = [...featuredDesigns, ...featuredDesigns];

export function FeaturedDesigns() {
  return (
    <section id="gallery" className="bg-cream-50 border-y overflow-hidden" style={{ borderColor: "var(--border)" }}>
      {/* Auto-scrolling marquee. Pauses on hover; respects reduced-motion. */}
      <div className="group relative py-16">
        <div className="marquee-track flex w-max">
          {track.map((design, i) => (
            <article
              key={`${design.title}-${i}`}
              aria-hidden={i >= featuredDesigns.length}
              className="mr-6 flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={design.image}
                  alt={design.alt}
                  fill
                  sizes="288px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold">{design.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {design.description}
                </p>
                <span className="text-gold-600 mt-4 text-sm font-medium">{design.price}</span>
                <Link
                  href="/#contact"
                  tabIndex={i >= featuredDesigns.length ? -1 : undefined}
                  className="bg-cream-100 hover:bg-gold-100 mt-4 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
