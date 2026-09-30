"use client";

import Image from "next/image";
import { useRef, useState } from "react";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

const frameClass = "aspect-[4/5] w-full overflow-hidden rounded-3xl";
const frameStyle = { background: "var(--color-cream-100)" } as const;

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // No images → friendly placeholder.
  if (images.length === 0) {
    return (
      <div
        className={`${frameClass} flex flex-col items-center justify-center gap-3`}
        style={frameStyle}
        aria-hidden
      >
        <span className="text-7xl">🎈</span>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          Photos coming soon
        </span>
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

  const arrowClass =
    "text-ink absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-lg backdrop-blur transition-all hover:scale-105 hover:bg-white group-hover:flex disabled:hidden";

  return (
    <div className="flex flex-col gap-4">
      {/* Main swipeable image track */}
      <div className="group relative">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className={`hide-scrollbar flex snap-x snap-mandatory overflow-x-auto ${frameClass}`}
          style={frameStyle}
        >
          {images.map((src, i) => (
            <div key={src} className="relative h-full w-full shrink-0 snap-center">
              <Image
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {multiple && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              disabled={active === 0}
              className={`${arrowClass} left-4`}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              disabled={active === images.length - 1}
              className={`${arrowClass} right-4`}
            >
              <Chevron direction="right" />
            </button>

            {/* Photo counter */}
            <span className="absolute right-4 bottom-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white tabular-nums backdrop-blur">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {multiple && (
        <div className="hide-scrollbar flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl transition-all ${
                i === active
                  ? "ring-gold-500 ring-2 ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
