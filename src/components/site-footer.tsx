"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { occasions } from "@/lib/occasions";

export function SiteFooter() {
  const pathname = usePathname();
  // The /admin area has its own chrome — no marketing footer there.
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer id="contact" className="bg-cream-100 mt-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-1">
          <p className="text-gold-600 font-serif text-2xl font-bold">Balloora</p>
          <p className="mt-3 max-w-xs text-sm" style={{ color: "var(--muted)" }}>
            Balloons, flowers, and bespoke event decor that turn moments into memories.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">Occasions</h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            {occasions.map((o) => (
              <li key={o.slug}>
                <Link href={`/explore?occasion=${o.slug}`} className="hover:text-gold-600">
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">Explore</h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>
              <Link href="/explore" className="hover:text-gold-600">
                Explore Collections
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-gold-600">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-gold-600">
                My Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">Get in touch</h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>hello@balloora.events</li>
            <li>+1 (555) 010-2030</li>
            <li>Mon–Sat, 9am–6pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        © {new Date().getFullYear()} Balloora Events. All rights reserved.
      </div>
    </footer>
  );
}
