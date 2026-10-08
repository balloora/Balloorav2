"use client";

import Image from "next/image";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { normalizeImage } from "@/lib/normalize-image";

const borderStyle = { borderColor: "var(--border)" } as const;

/**
 * Photo gallery field for admin forms. Submits kept URLs as `existing_images`
 * and new (WebP-converted) files as `images`. Reports while photos are being
 * converted so the parent can hold the submit button.
 */
export function ImagePicker({
  initialImages,
  onProcessingChange,
}: {
  initialImages: string[];
  onProcessingChange?: (processing: boolean) => void;
}) {
  const [keptImages, setKeptImages] = useState<string[]>(initialImages);
  const [processing, setProcessing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // New photos picked this session (already converted to WebP). Kept in state so
  // picking again adds to the selection, and each one can be removed.
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newPreviews = useMemo(() => newFiles.map((f) => URL.createObjectURL(f)), [newFiles]);
  useEffect(() => () => newPreviews.forEach((url) => URL.revokeObjectURL(url)), [newPreviews]);

  function setBusy(busy: boolean) {
    setProcessing(busy);
    onProcessingChange?.(busy);
  }

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

    setBusy(true);
    setImageError(null);
    try {
      const converted = await Promise.all(picked.map(normalizeImage));
      syncInput([...newFiles, ...converted]);
    } catch {
      syncInput(newFiles);
      setImageError("One of those images couldn't be read. Try exporting it as JPEG or PNG.");
    } finally {
      setBusy(false);
    }
  }

  return (
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
              <div className="bg-cream-100 relative h-24 w-24 overflow-hidden rounded-lg border" style={borderStyle}>
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
              <div className="bg-cream-100 relative h-24 w-24 overflow-hidden rounded-lg border" style={borderStyle}>
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
          processing ? "pointer-events-none opacity-60" : ""
        }`}
        style={borderStyle}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="text-gold-600" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m21 15-5-5-8 8" />
        </svg>
        {processing ? "Preparing photos…" : "Add photos"}
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
  );
}
