import type { ReactNode } from "react";

export interface Occasion {
  name: string;
  slug: string;
  icon: ReactNode;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Marketplace occasions. `slug` maps to /shop?occasion=<slug>. */
export const occasions: Occasion[] = [
  {
    name: "Birthday",
    slug: "birthday",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} aria-hidden>
        <path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7Z" />
        <path d="M8 12V9m4 3V9m4 3V9" />
        <path d="M12 5.5c0-1 1-1.5 0-3-1 1.5 0 2 0 3Z" />
        <path d="M4 16.5c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0 2.4-1 3.6 0" />
      </svg>
    ),
  },
  {
    name: "Baby Shower",
    slug: "baby-shower",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} aria-hidden>
        <path d="M10 3h4v2a2 2 0 0 1-4 0V3Z" />
        <path d="M9 8h6l1 4a5 5 0 0 1-8 0l1-4Z" />
        <path d="M9.5 20a2.5 2.5 0 0 0 5 0" />
      </svg>
    ),
  },
  {
    name: "Gender Reveal",
    slug: "gender-reveal",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} aria-hidden>
        <circle cx="10" cy="14" r="5" />
        <path d="M14 10l5-5m0 0h-4m4 0v4" />
      </svg>
    ),
  },
  {
    name: "Weddings",
    slug: "weddings",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} aria-hidden>
        <circle cx="9" cy="14" r="4.5" />
        <circle cx="15" cy="14" r="4.5" />
        <path d="M9 5l1.5 2M15 5l-1.5 2M12 3l-1.5 4h3L12 3Z" />
      </svg>
    ),
  },
  {
    name: "Corporate Events",
    slug: "corporate-events",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} aria-hidden>
        <path d="M8 3h4l-.5 6a1.5 1.5 0 0 1-3 0L8 3Z" />
        <path d="M13 3h4l-.5 6a1.5 1.5 0 0 1-3 0" />
        <path d="M10 12v6m4-6v6M8 21h8" />
      </svg>
    ),
  },
  {
    name: "Special Occasions",
    slug: "special-occasions",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} aria-hidden>
        <path d="M12 3l2.2 5.2L20 9l-4 3.8L17 19l-5-2.8L7 19l1-6.2L4 9l5.8-.8L12 3Z" />
      </svg>
    ),
  },
];
