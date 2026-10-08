"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  // The /admin area has its own chrome — no marketing footer there.
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer id="contact" className="bg-cream-100 mt-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-10">
        <div className="lg:col-span-1">
          <p className="text-gold-600 font-serif text-2xl font-bold">Balloora</p>
          <p className="mt-3 max-w-xs text-sm" style={{ color: "var(--muted)" }}>
            Balloons, flowers, and bespoke event decor that turn moments into memories.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">Browse</h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>
              <Link href="/products" className="hover:text-gold-600">
                Products
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gold-600">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-gold-600">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">Get in touch</h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>info@balloora.ca</li>
            <li>+1 (437) 261-1195</li>
            <li>Mon–Sat, 9am–6pm</li>
          </ul>
        </div>
      </div>

      <div
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t px-4 py-6 text-xs sm:flex-row sm:px-6 lg:px-10"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        <p>© {new Date().getFullYear()} Balloora Events. All rights reserved.</p>
        <nav aria-label="Legal" className="flex gap-5">
          <Link href="/privacy" className="hover:text-gold-600">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gold-600">
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
