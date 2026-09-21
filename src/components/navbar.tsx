"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart-context";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  // On the homepage the header floats over the full-screen hero (transparent,
  // light text) and turns solid once the user scrolls past it.
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overlay = isHome && !scrolled && !mobileOpen;

  // In-page anchors (e.g. /#contact) aren't treated as a "current page".
  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // The /admin area has its own chrome — hide the marketing header there.
  if (isAdmin) return null;

  return (
    <header
      className={`z-50 transition-colors duration-300 ${
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0"
      } ${overlay ? "bg-transparent text-white" : "border-b bg-white/90 backdrop-blur"}`}
      style={overlay ? undefined : { borderColor: "var(--border)" }}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="leading-none">
            <span
              className={`block font-serif text-2xl font-bold tracking-tight ${
                overlay ? "text-white" : "text-gold-600"
              }`}
            >
              Balloora
            </span>
            <span
              className={`block text-[0.6rem] font-medium tracking-[0.35em] uppercase ${
                overlay ? "text-white/70" : ""
              }`}
              style={overlay ? undefined : { color: "var(--muted)" }}
            >
              Events
            </span>
          </span>
        </Link>

        {/* Primary nav (desktop) */}
        <div className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:content-[''] ${
                  overlay
                    ? `after:bg-white hover:text-white ${
                        active ? "font-semibold after:w-full" : "text-white/85 after:w-0 hover:after:w-full"
                      }`
                    : `hover:text-gold-600 after:bg-gold-500 ${
                        active ? "text-gold-600 font-semibold after:w-full" : "after:w-0 hover:after:w-full"
                      }`
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/explore" aria-label="Search" className="hover:text-gold-600 hidden sm:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/#contact" aria-label="Call us" className="hover:text-gold-600 hidden sm:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 4h3l1.5 4L7.5 9.5a11 11 0 0 0 5 5l1.5-2L18 14v3a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="hover:text-gold-600 relative">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H9.5a2 2 0 0 1-2-1.6L5.2 4H3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {itemCount > 0 && (
              <span className="bg-gold-500 absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.65rem] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/#contact"
            className="bg-gold-500 hover:bg-gold-600 hidden rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors sm:inline-block"
          >
            Get a Quote
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d={mobileOpen ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t lg:hidden" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-sm font-medium">
            {navLinks.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 ${
                    active ? "bg-cream-100 text-gold-600 font-semibold" : "hover:bg-cream-100"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/#contact"
              className="bg-gold-500 mt-2 rounded-lg px-3 py-2.5 text-center text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
