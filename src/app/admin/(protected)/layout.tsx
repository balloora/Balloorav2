import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Balloora Admin" },
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b bg-white" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="text-gold-600 font-serif text-xl font-bold">Balloora</span>
            <span className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-gold-600 hidden sm:block" style={{ color: "var(--muted)" }}>
              View site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="hover:bg-cream-100 rounded-lg border px-3 py-1.5 font-medium transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
