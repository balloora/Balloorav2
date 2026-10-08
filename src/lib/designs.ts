export type FeaturedDesign = {
  /** Anchor id on /services (e.g. /services#classic-balloon-arch). */
  slug: string;
  title: string;
  description: string;
  price: string;
  image: string;
  alt: string;
};

// Signature designs: shown in the homepage Services showcase and on /services.
export const featuredDesigns: FeaturedDesign[] = [
  {
    slug: "classic-balloon-arch",
    title: "Classic Balloon Arch",
    description: "An elegant gold and cream balloon arch that suits any celebration.",
    price: "Starting at $180",
    image: "/design-classic-arch.jpg",
    alt: "Classic gold and cream balloon arch",
  },
  {
    slug: "birthday-backdrop",
    title: "Birthday Backdrop",
    description: "A playful balloon backdrop with neon signage for milestone birthdays.",
    price: "Starting at $250",
    image: "/design-birthday-backdrop.jpg",
    alt: "Pink and gold birthday balloon backdrop with neon sign",
  },
  {
    slug: "kids-theme-setup",
    title: "Kids Theme Setup",
    description: "Whimsical balloon styling built around your child's favorite theme.",
    price: "Starting at $300",
    image: "/design-kids-theme.jpg",
    alt: "Blue balloon arch with teddy bear and number one for first birthday",
  },
  {
    slug: "gender-reveal-setup",
    title: "Gender Reveal Setup",
    description: "A dramatic, pop-worthy design for your big reveal moment.",
    price: "Starting at $350",
    image: "/design-gender-reveal.jpg",
    alt: "Pink and blue gender reveal balloon setup with 'Boy or Girl' sign",
  },
  {
    slug: "baby-shower-decor",
    title: "Baby Shower Decor",
    description: "Soft, sage-toned balloon styling to welcome your little one.",
    price: "Starting at $300",
    image: "/design-baby-shower.jpg",
    alt: "Sage and cream balloon arch with florals for a baby shower",
  },
  {
    slug: "wedding-backdrop",
    title: "Wedding Backdrop",
    description: "Ivory florals and balloons framing your ceremony or reception.",
    price: "Starting at $450",
    image: "/design-wedding-backdrop.jpg",
    alt: "Ivory floral and balloon wedding backdrop with 'Mr and Mrs' sign",
  },
  {
    slug: "table-centerpieces",
    title: "Table Centerpieces",
    description: "Balloon and floral accents sized perfectly for guest tables.",
    price: "Starting at $60",
    image: "/design-centerpieces.jpg",
    alt: "Balloon and floral table centerpiece",
  },
  {
    slug: "corporate-events",
    title: "Corporate Events",
    description: "Polished black and gold styling for brand launches and corporate events.",
    price: "Starting at $400",
    image: "/design-corporate.jpg",
    alt: "Black and gold balloon arch for a corporate event",
  },
  {
    slug: "balloon-columns",
    title: "Balloon Columns",
    description: "Classic balloon columns to frame entrances and stage areas.",
    price: "Starting at $150",
    image: "/design-columns.jpg",
    alt: "White and gold balloon columns flanking an entrance",
  },
  {
    slug: "event-ceiling-decor",
    title: "Event Ceiling Decor",
    description: "Overhead balloon installations that transform any venue.",
    price: "Starting at $500",
    image: "/design-ceiling.jpg",
    alt: "Gold and white balloon ceiling installation over a reception hall",
  },
];
