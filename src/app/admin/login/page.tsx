import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { login } from "@/app/admin/actions";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  if (await isAdminAuthenticated()) redirect("/admin");

  const configured = isAdminConfigured();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div
        className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-gold-600 font-serif text-2xl font-bold">Balloora</p>
        <h1 className="mt-1 text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Enter the admin password to manage products.
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg border border-dashed p-3 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Admin login is disabled: set <code>ADMIN_PASSWORD</code> in your environment, then restart.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Incorrect password.</p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={!configured}
              className="focus:border-gold-400 focus:ring-gold-200 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 disabled:opacity-50"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
          <button
            type="submit"
            disabled={!configured}
            className="bg-gold-500 hover:bg-gold-600 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
