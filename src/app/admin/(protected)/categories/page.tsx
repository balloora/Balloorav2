import type { Metadata } from "next";

import { createCategory, deleteCategory, moveCategory, renameCategory } from "@/app/admin/actions";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Category } from "@/types/database.types";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

const inputClass =
  "focus:border-gold-400 focus:ring-gold-200 w-full min-w-0 rounded-lg border bg-white px-3 py-2.5 text-base outline-none focus:ring-2 sm:text-sm";
const borderStyle = { borderColor: "var(--border)" } as const;

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

function MoveButton({ id, direction, disabled }: { id: string; direction: "up" | "down"; disabled: boolean }) {
  return (
    <form action={moveCategory}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={direction === "up" ? "Move up" : "Move down"}
        className="hover:bg-cream-100 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors disabled:opacity-30 disabled:hover:bg-transparent sm:h-9 sm:w-9"
        style={borderStyle}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={direction === "up" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
        </svg>
      </button>
    </form>
  );
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  let categories: Category[] = [];
  const counts = new Map<string, number>();
  let loadError: string | null = null;

  if (!isSupabaseConfigured) {
    loadError = "Supabase isn't configured. Set the Supabase environment variables and restart.";
  } else {
    const supabase = createAdminClient();
    const [{ data, error: catError }, { data: products }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order").order("name"),
      supabase.from("products").select("category"),
    ]);
    if (catError) loadError = catError.message;
    categories = data ?? [];
    for (const p of products ?? []) {
      if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Shown on the homepage, the Products page filters and the footer, in this order. Renaming a
          category updates every product in it.
        </p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loadError ? (
        <p className="rounded-xl border border-dashed p-6 text-sm" style={{ ...borderStyle, color: "var(--muted)" }}>
          {loadError}
        </p>
      ) : (
        <>
          {/* Add */}
          <form action={createCategory} className="mb-6 flex gap-2 rounded-xl border bg-white p-3" style={borderStyle}>
            <input name="name" required placeholder="New category, e.g. Graduation" aria-label="New category name" className={inputClass} style={borderStyle} />
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              + Add
            </button>
          </form>

          {categories.length === 0 ? (
            <p className="rounded-xl border border-dashed p-10 text-center text-sm" style={{ ...borderStyle, color: "var(--muted)" }}>
              No categories yet. Add your first one above.
            </p>
          ) : (
            <ul className="space-y-2">
              {categories.map((c, i) => {
                const count = counts.get(c.name) ?? 0;
                return (
                  <li key={c.id} className="flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:items-center" style={borderStyle}>
                    {/* Rename */}
                    <form action={renameCategory} className="flex min-w-0 flex-1 gap-2">
                      <input type="hidden" name="id" value={c.id} />
                      <input name="name" required defaultValue={c.name} aria-label={`Rename ${c.name}`} className={inputClass} style={borderStyle} />
                      <button
                        type="submit"
                        className="hover:bg-cream-100 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors"
                        style={borderStyle}
                      >
                        Save
                      </button>
                    </form>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <span className="text-xs whitespace-nowrap sm:w-20 sm:text-right" style={{ color: "var(--muted)" }}>
                        {count} {count === 1 ? "product" : "products"}
                      </span>
                      <div className="flex items-center gap-2">
                        <MoveButton id={c.id} direction="up" disabled={i === 0} />
                        <MoveButton id={c.id} direction="down" disabled={i === categories.length - 1} />
                        <DeleteProductButton
                          id={c.id}
                          title={c.name}
                          action={deleteCategory}
                          warning={count > 0 ? `Its ${count} ${count === 1 ? "product" : "products"} will become uncategorised.` : undefined}
                          className="h-10 px-3 text-sm sm:h-9"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
