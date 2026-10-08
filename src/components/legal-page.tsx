import type { ReactNode } from "react";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Shared layout for the Privacy Policy and Terms & Conditions pages. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <header className="max-w-3xl">
        <p className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          Last updated: {updated}
        </p>
        <div className="mt-6 space-y-4 leading-relaxed" style={{ color: "var(--muted)" }}>
          {intro}
        </div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_1fr]">
        {/* Contents */}
        <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase">Contents</p>
          <ol className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-gold-600">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal-prose max-w-3xl space-y-12">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-serif text-2xl font-semibold">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--muted)" }}>
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
