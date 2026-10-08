import Image from "next/image";
import Link from "next/link";

// Our promises: commitments, not metrics. Each pairs with a photo of the work.
const promises = [
  {
    title: "Made for your moment",
    body: "No copy-paste setups. Every design starts with your colours, your theme, and your story.",
    image: "/design-kids-theme.jpg",
    alt: "Custom first birthday balloon setup",
  },
  {
    title: "Balloons, blooms & decor, together",
    body: "One team styling the whole space, so every piece feels like it belongs.",
    image: "/design-wedding-backdrop.jpg",
    alt: "Floral and balloon wedding backdrop",
  },
  {
    title: "Every detail, considered",
    body: "From the shape of an arch to the last finishing touch, nothing is an afterthought.",
    image: "/design-centerpieces.jpg",
    alt: "Balloon and floral table centerpiece",
  },
  {
    title: "Your estimate is on us",
    body: "Share your vision and we'll put together a complimentary quote, with no pressure.",
    image: "/design-classic-arch.jpg",
    alt: "Gold and cream balloon arch",
  },
];

export function AboutFlow() {
  return (
    <section id="about" className="bg-cream-50 relative isolate overflow-hidden border-y" style={{ borderColor: "var(--border)" }}>
      {/* Soft glow accents */}
      <div aria-hidden className="bg-gold-200/40 absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full blur-3xl" />
      <div aria-hidden className="bg-gold-100/60 absolute -right-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        {/* Intro */}
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Our story</p>
          <h2 className="mt-4 flex flex-col items-center leading-none">
            <span className="font-serif text-3xl font-semibold sm:text-4xl">Designed to</span>
            <span className="font-script text-gold-500 -mt-1 text-7xl sm:text-8xl">Delight</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            From intimate gatherings to grand celebrations, Balloora crafts balloon installations,
            floral styling, and full event decor tailored to your vision.
          </p>
          <p className="font-serif mt-4 text-xl italic">
            You bring the reason to celebrate. We&apos;ll bring the wow.
          </p>
        </div>

        {/* The flow */}
        <ol className="relative mt-16 lg:mt-24">
          {/* Track + scroll-filled line (left on phones, centred on desktop) */}
          <div aria-hidden className="bg-gold-200/60 absolute top-0 bottom-0 left-5 w-px lg:left-1/2 lg:-translate-x-1/2" />
          <div
            aria-hidden
            className="flow-fill from-gold-300 via-gold-500 to-gold-400 absolute top-0 bottom-0 left-5 w-0.5 origin-top -translate-x-[0.5px] bg-gradient-to-b lg:left-1/2 lg:-translate-x-1/2"
          />

          {promises.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <li
                key={p.title}
                className="relative grid items-center gap-6 pb-14 pl-16 last:pb-0 lg:grid-cols-[1fr_5rem_1fr] lg:gap-0 lg:pb-20 lg:pl-0"
              >
                {/* Node */}
                <span
                  className="bg-gold-500 ring-cream-50 absolute top-0 left-5 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full font-serif text-sm font-semibold text-white shadow-md ring-8 lg:static lg:col-start-2 lg:row-start-1 lg:mx-auto lg:h-14 lg:w-14 lg:translate-x-0 lg:text-base"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Text card */}
                <div
                  className={`reveal lg:row-start-1 ${
                    flip ? "lg:col-start-3 lg:pl-10" : "lg:col-start-1 lg:pr-10 lg:text-right"
                  }`}
                >
                  <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-serif text-2xl font-semibold">{p.title}</h3>
                    <p className="mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {p.body}
                    </p>
                  </div>
                </div>

                {/* Floating photo (desktop) */}
                <div
                  className={`reveal hidden lg:row-start-1 lg:flex ${
                    flip ? "lg:col-start-1 lg:justify-end lg:pr-10" : "lg:col-start-3 lg:pl-10"
                  }`}
                >
                  <div className="bob relative h-44 w-44 overflow-hidden rounded-full shadow-xl ring-8 ring-white" style={{ animationDelay: `${i * -1.5}s` }}>
                    <Image src={p.image} alt={p.alt} fill sizes="176px" className="object-cover" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="reveal mt-16 text-center lg:mt-20">
          <Link
            href="/#contact"
            className="bg-gold-500 hover:bg-gold-600 group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-medium text-white shadow-sm transition-colors"
          >
            Get a Quote
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
