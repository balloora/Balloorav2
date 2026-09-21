import Image from "next/image";
import Link from "next/link";

import { deleteProduct } from "@/app/admin/actions";
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-gold-500 hover:bg-gold-600 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
        >
          + New product
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

      {products.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Stock</th>
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
                  <td className="hidden px-4 py-3 sm:table-cell" style={{ color: "var(--muted)" }}>
                    {p.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price_cents, p.currency)}</td>
                  <td className="hidden px-4 py-3 sm:table-cell" style={{ color: "var(--muted)" }}>
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
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
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
