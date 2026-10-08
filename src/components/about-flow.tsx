import Image from "next/image";
import Link from "next/link";

// Our promises: commitments, not metrics. Each pairs with a photo of the work.
const promises = [
  {
    title: "Made for your moment",
    body: "Every design starts with your colours, your theme, and your story.",
    image: "/design-kids-theme.jpg",
    alt: "Custom first birthday balloon setup",
  },
  {
    title: "Balloons, blooms & decor",
    body: "One team styling the whole space, so every piece belongs.",
    image: "/design-wedding-backdrop.jpg",
    alt: "Floral and balloon wedding backdrop",
  },
  {
    title: "Every detail, considered",
    body: "From the shape of an arch to the last finishing touch.",
    image: "/design-centerpieces.jpg",
    alt: "Balloon and floral table centerpiece",
  },
  {
    title: "Your estimate is on us",
    body: "Share your vision and get a complimentary quote, no pressure.",
    image: "/design-classic-arch.jpg",
    alt: "Gold and cream balloon arch",
  },
];

export function AboutFlow() {
  return (
    <section id="about" className="bg-cream-50 relative isolate scroll-mt-20 overflow-hidden border-y" style={{ borderColor: "var(--border)" }}>
      {/* Soft glow accents */}
      <div aria-hidden className="bg-gold-200/40 absolute -top-32 -left-32 -z-10 h-80 w-80 rounded-full blur-3xl" />
      <div aria-hidden className="bg-gold-100/60 absolute -right-40 -bottom-20 -z-10 h-96 w-96 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        {/* Intro: heading left, story + CTA right */}
        <div className="reveal grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Our story</p>
            <h2 className="mt-3 flex flex-wrap items-baseline gap-x-3 leading-none">
              <span className="font-serif text-3xl font-semibold sm:text-4xl">Designed to</span>
              <span className="font-script text-gold-500 text-6xl sm:text-7xl">Delight</span>
            </h2>
          </div>
          <div>
            <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
              From intimate gatherings to grand celebrations, Balloora crafts balloon installations,
              floral styling, and full event decor tailored to your vision. You bring the reason to
              celebrate. We&apos;ll bring the wow.
            </p>
            <Link
              href="/#contact"
              className="text-gold-600 group mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              Get a Quote
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* The flow: a horizontal line linking four steps */}
        <ol className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-8 lg:mt-14 lg:grid-cols-4 lg:gap-8">
          {/* Track + scroll-filled line through the photo centres (desktop) */}
          <div aria-hidden className="bg-gold-200/70 absolute top-14 right-[12.5%] left-[12.5%] hidden h-px lg:block" />
          <div
            aria-hidden
            className="flow-fill-x from-gold-300 via-gold-500 to-gold-400 absolute top-14 right-[12.5%] left-[12.5%] hidden h-0.5 origin-left -translate-y-[0.5px] bg-gradient-to-r lg:block"
          />

          {promises.map((p, i) => (
            <li key={p.title} className="reveal relative flex flex-col items-center text-center" style={{ animationRangeStart: `entry ${i * 8}%` }}>
              <div className="relative">
                <div
                  className="bob relative h-24 w-24 overflow-hidden rounded-full shadow-lg ring-4 ring-white sm:h-28 sm:w-28"
                  style={{ animationDelay: `${i * -1.5}s` }}
                >
                  <Image src={p.image} alt={p.alt} fill sizes="112px" className="object-cover" />
                </div>
                <span className="bg-gold-500 ring-cream-50 absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full font-serif text-xs font-semibold text-white shadow ring-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-lg leading-snug font-semibold sm:text-xl">{p.title}</h3>
              <p className="mt-1.5 max-w-[16rem] text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
