"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // No images → friendly placeholder.
  if (images.length === 0) {
    return (
      <div
        className="flex aspect-square w-full items-center justify-center rounded-2xl border text-6xl"
        style={{ borderColor: "var(--border)", background: "var(--color-cream-100)" }}
        aria-hidden
      >
        🎈
      </div>
    );
  }

  const scrollTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const index = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActive(Math.max(0, Math.min(index, images.length - 1)));
  };

  const go = (delta: number) => scrollTo(Math.max(0, Math.min(active + delta, images.length - 1)));
  const multiple = images.length > 1;

  return (
    <div className="flex flex-col gap-3">
      {/* Main swipeable image track */}
      <div className="group relative">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl border"
          style={{ borderColor: "var(--border)", background: "var(--color-cream-100)" }}
        >
          {images.map((src, i) => (
            <div key={src} className="relative aspect-square w-full shrink-0 snap-center">
              <Image
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {multiple && (
          <>
            {/* Prev / next arrows (appear on hover, desktop) */}
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              disabled={active === 0}
              className="absolute top-1/2 left-3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity group-hover:flex disabled:opacity-0"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              disabled={active === images.length - 1}
              className="absolute top-1/2 right-3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity group-hover:flex disabled:opacity-0"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute right-0 bottom-3 left-0 flex justify-center gap-1.5">
              {images.map((src, i) => (
                <span
                  key={src}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "bg-gold-500 w-4" : "w-1.5 bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {multiple && (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? "border-gold-500" : "border-transparent hover:border-gold-200"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
