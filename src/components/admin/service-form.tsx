"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { saveService } from "@/app/admin/actions";
import { ImagePicker } from "@/components/admin/image-picker";
import { serviceTypes } from "@/lib/services";
import type { Service } from "@/types/database.types";

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
      {processing ? "Preparing images…" : pending ? "Saving…" : "Save service"}
    </button>
  );
}

export function ServiceForm({ service, error }: { service?: Service; error?: string }) {
  const initialImages = service?.images?.length
    ? service.images
    : service?.image_url
      ? [service.image_url]
      : [];
  const [serviceType, setServiceType] = useState<string>(service?.service_type ?? serviceTypes[0].name);
  const [processingImages, setProcessingImages] = useState(false);
  const isVenue = serviceType === "Venue";

  return (
    <form action={saveService} className="max-w-2xl space-y-6 pb-4 sm:pb-0">
      {service?.id && <input type="hidden" name="id" value={service.id} />}

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <span className="mb-2 block text-sm font-medium">Type</span>
        <input type="hidden" name="service_type" value={serviceType} />
        <div className="flex flex-wrap gap-2">
          {serviceTypes.map((t) => {
            const selected = serviceType === t.name;
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setServiceType(t.name)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  selected ? "bg-gold-500 border-gold-500 text-white" : "hover:bg-cream-100 text-ink"
                }`}
                style={selected ? undefined : inputStyle}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={service?.title}
          placeholder={isVenue ? "e.g. The Garden Hall" : "e.g. Birthday Party Package"}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={service?.slug}
          placeholder="auto-generated from title"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-medium">
          Short summary
        </label>
        <input
          id="summary"
          name="summary"
          maxLength={160}
          defaultValue={service?.summary ?? ""}
          placeholder="One line shown on the services listing"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={service?.description ?? ""}
          placeholder="What's included, how it works, anything guests should know."
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            defaultValue={service?.location ?? ""}
            placeholder={isVenue ? "e.g. Mississauga, ON" : "Optional"}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="capacity" className="mb-1 block text-sm font-medium">
            Guest capacity
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            defaultValue={service?.capacity ?? ""}
            placeholder="Optional"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price_from" className="mb-1 block text-sm font-medium">
            Starting price (CAD)
          </label>
          <input
            id="price_from"
            name="price_from"
            type="number"
            step="0.01"
            min="0"
            defaultValue={service?.price_from_cents != null ? (service.price_from_cents / 100).toFixed(2) : ""}
            placeholder="Blank = quote on request"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select id="status" name="status" defaultValue={service?.status ?? "active"} className={inputClass} style={inputStyle}>
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
          href="/admin/services"
          className="rounded-lg px-4 py-3 text-sm font-medium hover:underline sm:px-0 sm:py-0"
          style={{ color: "var(--muted)" }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
