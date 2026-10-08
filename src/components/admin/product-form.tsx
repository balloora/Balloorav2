"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { saveProduct } from "@/app/admin/actions";
import { ImagePicker } from "@/components/admin/image-picker";
import { occasions } from "@/lib/occasions";
import type { Product } from "@/types/database.types";

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

export function ProductForm({ product, error }: { product?: Product; error?: string }) {
  const initialImages = product?.images?.length
    ? product.images
    : product?.image_url
      ? [product.image_url]
      : [];
  const [category, setCategory] = useState<string>(product?.category ?? "");
  const [processingImages, setProcessingImages] = useState(false);

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
          {occasions.map((o) => {
            const selected = category === o.name;
            return (
              <button
                key={o.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(selected ? "" : o.name)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  selected
                    ? "bg-gold-500 border-gold-500 text-white"
                    : "hover:bg-cream-100 text-ink"
                }`}
                style={selected ? undefined : inputStyle}
              >
                <span className={`[&>svg]:h-4 [&>svg]:w-4 ${selected ? "text-white" : "text-gold-600"}`}>
                  {o.icon}
                </span>
                {o.name}
              </button>
            );
          })}
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
