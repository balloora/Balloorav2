import Image from "next/image";
import Link from "next/link";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-gray-100 text-gray-600",
};

export default async function AdminDashboard() {
  let products: Awaited<ReturnType<typeof loadProducts>> = [];
  let loadError: string | null = null;

  if (!isSupabaseConfigured) {
    loadError = "Supabase isn't configured. Set the Supabase environment variables and restart.";
  } else {
    try {
      products = await loadProducts();
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Failed to load products.";
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-gold-500 hover:bg-gold-600 shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
        >
          + New<span className="hidden sm:inline"> product</span>
        </Link>
      </div>

      {loadError && (
        <p className="rounded-xl border border-dashed p-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          {loadError}
        </p>
      )}

      {!loadError && products.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No products yet.
          </p>
          <Link href="/admin/products/new" className="text-gold-600 mt-2 inline-block text-sm font-medium hover:underline">
            Add your first product →
          </Link>
        </div>
      )}

      {/* Phones: one card per product */}
      {products.length > 0 && (
        <ul className="space-y-3 md:hidden">
          {products.map((p) => (
            <li key={p.id} className="rounded-xl border bg-white p-3" style={{ borderColor: "var(--border)" }}>
              <Link href={`/admin/products/${p.id}`} className="flex gap-3">
                <div className="bg-cream-100 relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  {p.image_url && <Image src={p.image_url} alt="" fill sizes="64px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 font-medium">{p.title}</p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[p.status] ?? ""}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    {formatPrice(p.price_cents, p.currency)} · {p.inventory} in stock
                    {p.category ? ` · ${p.category}` : ""}
                  </p>
                </div>
              </Link>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="hover:bg-cream-100 rounded-lg border py-2.5 text-center text-sm font-medium transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  Edit
                </Link>
                <DeleteProductButton id={p.id} title={p.title} className="w-full py-2.5 text-sm" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Tablet & desktop: table */}
      {products.length > 0 && (
        <div className="hidden overflow-hidden rounded-xl border bg-white md:block" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-cream-100 relative h-11 w-11 shrink-0 overflow-hidden rounded-md">
                        {p.image_url && (
                          <Image src={p.image_url} alt="" fill sizes="44px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.title}</p>
                        <p className="truncate text-xs" style={{ color: "var(--muted)" }}>
                          /{p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--muted)" }}>
                    {p.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price_cents, p.currency)}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted)" }}>
                    {p.inventory}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[p.status] ?? ""}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="hover:bg-cream-100 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                        style={{ borderColor: "var(--border)" }}
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} title={p.title} className="px-3 py-1.5 text-xs" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

async function loadProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
