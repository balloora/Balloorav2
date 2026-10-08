"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { saveProduct } from "@/app/admin/actions";
import { ImagePicker } from "@/components/admin/image-picker";
import { HOMEPAGE_PRODUCTS_MAX, HOMEPAGE_PRODUCTS_MIN } from "@/lib/homepage";
import type { Category, Product } from "@/types/database.types";

const inputClass =
  "focus:border-gold-400 focus:ring-gold-200 w-full rounded-lg border bg-white px-3 py-2.5 text-base outline-none focus:ring-2 sm:text-sm";
const inputStyle = { borderColor: "var(--border)" } as const;

function SubmitButton({ processing }: { processing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || processing}
      className="bg-gold-500 hover:bg-gold-600 flex-1 rounded-lg px-5 py-3 text-sm font-medium text-white transition-colors disabled:opacity-60 sm:flex-none sm:py-2.5"
    >
      {processing ? "Preparing images…" : pending ? "Saving…" : "Save product"}
    </button>
  );
}

export function ProductForm({
  product,
  categories,
  homepageCount,
  error,
}: {
  product?: Product;
  categories: Category[];
  /** Other products currently in the homepage preview (excluding this one). */
  homepageCount: number;
  error?: string;
}) {
  const initialImages = product?.images?.length
    ? product.images
    : product?.image_url
      ? [product.image_url]
      : [];
  const [category, setCategory] = useState<string>(product?.category ?? "");
  const [processingImages, setProcessingImages] = useState(false);
  const [onHomepage, setOnHomepage] = useState(product?.show_on_homepage ?? false);
  const homepageTotal = homepageCount + (onHomepage ? 1 : 0);

  return (
    <form action={saveProduct} className="max-w-2xl space-y-6 pb-4 sm:pb-0">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input id="title" name="title" required defaultValue={product?.title} className={inputClass} style={inputStyle} />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={product?.slug}
          placeholder="auto-generated from title"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">Category</span>
        <input type="hidden" name="category" value={category} />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const selected = category === c.name;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(selected ? "" : c.name)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  selected ? "bg-gold-500 border-gold-500 text-white" : "hover:bg-cream-100 text-ink"
                }`}
                style={selected ? undefined : inputStyle}
              >
                {c.name}
              </button>
            );
          })}
          <Link
            href="/admin/categories"
            className="hover:bg-cream-100 rounded-full border border-dashed px-3.5 py-1.5 text-sm font-medium transition-colors"
            style={{ ...inputStyle, color: "var(--muted)" }}
          >
            Manage categories
          </Link>
        </div>
        {category && (
          <button
            type="button"
            onClick={() => setCategory("")}
            className="mt-2 text-xs font-medium hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Clear category
          </button>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Price (CAD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product ? (product.price_cents / 100).toFixed(2) : ""}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="inventory" className="mb-1 block text-sm font-medium">
            Inventory
          </label>
          <input
            id="inventory"
            name="inventory"
            type="number"
            min="0"
            defaultValue={product?.inventory ?? 0}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select id="status" name="status" defaultValue={product?.status ?? "active"} className={inputClass} style={inputStyle}>
            <option value="active">Active (visible)</option>
            <option value="draft">Draft (hidden)</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <ImagePicker initialImages={initialImages} onProcessingChange={setProcessingImages} />

      {/* Homepage preview */}
      <div className="rounded-xl border bg-white p-4" style={inputStyle}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="show_on_homepage"
            checked={onHomepage}
            onChange={(e) => setOnHomepage(e.currentTarget.checked)}
            className="accent-gold-500 mt-0.5 h-5 w-5 shrink-0"
          />
          <span>
            <span className="block text-sm font-medium">Show in homepage preview</span>
            <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
              Appears in the scrolling Shop section on the homepage. Needs Active status and at least
              one photo.
            </span>
          </span>
        </label>
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-xs ${
            homepageTotal < HOMEPAGE_PRODUCTS_MIN || homepageTotal > HOMEPAGE_PRODUCTS_MAX
              ? "bg-amber-50 text-amber-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          {homepageTotal} {homepageTotal === 1 ? "product" : "products"} on the homepage after saving.{" "}
          {homepageTotal === 0
            ? "The Shop section will be hidden."
            : homepageTotal < HOMEPAGE_PRODUCTS_MIN
              ? `Pick at least ${HOMEPAGE_PRODUCTS_MIN} so photos don't visibly repeat.`
              : homepageTotal > HOMEPAGE_PRODUCTS_MAX
                ? `Only the ${HOMEPAGE_PRODUCTS_MAX} newest will be shown.`
                : `Looks good (${HOMEPAGE_PRODUCTS_MIN}–${HOMEPAGE_PRODUCTS_MAX} recommended).`}
        </p>
      </div>

      {/* Pinned to the bottom of the screen on phones so Save is always in reach */}
      <div
        className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:pt-2 sm:backdrop-blur-none"
        style={{ borderColor: "var(--border)", paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <SubmitButton processing={processingImages} />
        <Link
          href="/admin"
          className="rounded-lg px-4 py-3 text-sm font-medium hover:underline sm:px-0 sm:py-0"
          style={{ color: "var(--muted)" }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
