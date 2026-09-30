"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveProduct } from "@/app/admin/actions";
import { normalizeImage } from "@/lib/normalize-image";
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
  const [keptImages, setKeptImages] = useState<string[]>(initialImages);
  const [category, setCategory] = useState<string>(product?.category ?? "");
  const [processingImages, setProcessingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // New photos picked this session (already converted to WebP). Kept in state so
  // picking again adds to the selection, and each one can be removed.
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newPreviews = useMemo(() => newFiles.map((f) => URL.createObjectURL(f)), [newFiles]);
  useEffect(() => () => newPreviews.forEach((url) => URL.revokeObjectURL(url)), [newPreviews]);

  // Keep the real <input type="file"> (what the form submits) in sync with state.
  function syncInput(files: File[]) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
    setNewFiles(files);
  }

  // Convert picked files (incl. HEIC) to compact WebP before the form submits.
  async function handleImagesChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.currentTarget.files ?? []);
    if (picked.length === 0) return;

    setProcessingImages(true);
    setImageError(null);
    try {
      const converted = await Promise.all(picked.map(normalizeImage));
      syncInput([...newFiles, ...converted]);
    } catch {
      syncInput(newFiles);
      setImageError("One of those images couldn't be read. Try exporting it as JPEG or PNG.");
    } finally {
      setProcessingImages(false);
    }
  }

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
                  className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow sm:h-6 sm:w-6 sm:text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {newPreviews.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {newPreviews.map((url, i) => (
              <div key={url} className="relative">
                <div className="bg-cream-100 relative h-24 w-24 overflow-hidden rounded-lg border" style={inputStyle}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 text-[10px] font-medium text-white">
                    New
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => syncInput(newFiles.filter((_, j) => j !== i))}
                  aria-label="Remove new image"
                  className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow sm:h-6 sm:w-6 sm:text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          className={`hover:bg-cream-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-sm font-medium transition-colors ${
            processingImages ? "pointer-events-none opacity-60" : ""
          }`}
          style={inputStyle}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="text-gold-600" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="m21 15-5-5-8 8" />
          </svg>
          {processingImages ? "Preparing photos…" : "Add photos"}
          <input
            ref={fileInputRef}
            type="file"
            name="images"
            accept="image/*,.heic,.heif"
            multiple
            onChange={handleImagesChange}
            className="sr-only"
          />
        </label>
        {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
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
