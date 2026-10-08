"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Products", href: "/admin", match: (p: string) => p === "/admin" || p.startsWith("/admin/products") },
  { label: "Categories", href: "/admin/categories", match: (p: string) => p.startsWith("/admin/categories") },
  { label: "Services", href: "/admin/services", match: (p: string) => p.startsWith("/admin/services") },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav className="mx-auto flex max-w-6xl gap-6 px-4 text-sm font-medium sm:px-6 lg:px-8">
      {tabs.map((t) => {
        const active = t.match(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 py-3 transition-colors ${
              active ? "border-gold-500 text-gold-600" : "hover:text-gold-600 border-transparent"
            }`}
            style={active ? undefined : { color: "var(--muted)" }}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
