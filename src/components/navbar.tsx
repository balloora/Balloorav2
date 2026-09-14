"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart-context";

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--background) 85%, transparent)",
      }}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--color-brand-600)" }}
            aria-hidden
          >
            B
          </span>
          Balloora
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Browse
          </Link>
          <Link href="/account" className="hover:underline">
            Account
          </Link>
          <Link href="/cart" className="relative inline-flex items-center gap-1 hover:underline">
            Cart
            {itemCount > 0 && (
              <span
                className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white"
                style={{ background: "var(--color-brand-600)" }}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
