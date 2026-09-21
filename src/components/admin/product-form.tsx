"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { saveProduct } from "@/app/admin/actions";
import type { Product } from "@/types/database.types";

const inputClass =
  "focus:border-gold-400 focus:ring-gold-200 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2";
const inputStyle = { borderColor: "var(--border)" } as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gold-500 hover:bg-gold-600 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save product"}
    </button>
  );
}

export function ProductForm({ product, error }: { product?: Product; error?: string }) {
  const initialImages = product?.images?.length
    ? product.images
    : product?.image_url
      ? [product.image_url]
      : [];
  const [keptImages, setKeptImages] = useState<string[]>(initialImages);

  return (
    <form action={saveProduct} className="max-w-2xl space-y-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input id="title" name="title" required defaultValue={product?.title} className={inputClass} style={inputStyle} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <input id="category" name="category" defaultValue={product?.category ?? ""} className={inputClass} style={inputStyle} />
        </div>
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

      <div className="grid gap-4 sm:grid-cols-3">
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
        <div>
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

      {/* Images */}
      <div>
        <span className="mb-1 block text-sm font-medium">Images</span>
        <p className="mb-3 text-xs" style={{ color: "var(--muted)" }}>
          The first image is used as the cover. Upload one or more; add more anytime.
        </p>

        {keptImages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {keptImages.map((url) => (
              <div key={url} className="relative">
                <input type="hidden" name="existing_images" value={url} />
                <div className="bg-cream-100 relative h-24 w-24 overflow-hidden rounded-lg border" style={inputStyle}>
                  <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setKeptImages((prev) => prev.filter((u) => u !== url))}
                  aria-label="Remove image"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-cream-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-cream-200"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Link href="/admin" className="text-sm font-medium hover:underline" style={{ color: "var(--muted)" }}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
