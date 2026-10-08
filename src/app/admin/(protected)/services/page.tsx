import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { deleteService } from "@/app/admin/actions";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import type { Service } from "@/types/database.types";

export const metadata: Metadata = { title: "Services" };
export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-gray-100 text-gray-600",
};

function priceLabel(s: Service) {
  return s.price_from_cents != null ? `From ${formatPrice(s.price_from_cents, s.currency)}` : "Quote";
}

export default async function AdminServicesPage() {
  let services: Service[] = [];
  let loadError: string | null = null;

  if (!isSupabaseConfigured) {
    loadError = "Supabase isn't configured. Set the Supabase environment variables and restart.";
  } else {
    try {
      services = await loadServices();
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Failed to load services.";
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Venues, event packages and other offerings customers request quotes for.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="bg-gold-500 hover:bg-gold-600 shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
        >
          + New<span className="hidden sm:inline"> service</span>
        </Link>
      </div>

      {loadError && (
        <p className="rounded-xl border border-dashed p-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          {loadError}
        </p>
      )}

      {!loadError && services.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No services yet.
          </p>
          <Link href="/admin/services/new" className="text-gold-600 mt-2 inline-block text-sm font-medium hover:underline">
            Add your first venue or event →
          </Link>
        </div>
      )}

      {services.length > 0 && (
        <ul className="space-y-3">
          {services.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:items-center"
              style={{ borderColor: "var(--border)" }}
            >
              <Link href={`/admin/services/${s.id}`} className="flex min-w-0 flex-1 gap-3">
                <div className="bg-cream-100 relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  {s.image_url && <Image src={s.image_url} alt="" fill sizes="64px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2 sm:justify-start">
                    <p className="line-clamp-2 font-medium">{s.title}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[s.status] ?? ""}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    {s.service_type} · {priceLabel(s)}
                    {s.location ? ` · ${s.location}` : ""}
                  </p>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Link
                  href={`/admin/services/${s.id}`}
                  className="hover:bg-cream-100 rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors sm:py-1.5"
                  style={{ borderColor: "var(--border)" }}
                >
                  Edit
                </Link>
                <DeleteProductButton
                  id={s.id}
                  title={s.title}
                  action={deleteService}
                  className="w-full px-4 py-2.5 text-sm sm:py-1.5"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function loadServices() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
