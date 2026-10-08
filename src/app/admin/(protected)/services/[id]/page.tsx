import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ServiceForm } from "@/components/admin/service-form";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Edit Service" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditServicePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = createAdminClient();
  const { data: service } = await supabase.from("services").select("*").eq("id", id).single();
  if (!service) notFound();

  return (
    <div>
      <Link href="/admin/services" className="text-gold-600 text-sm font-medium hover:underline">
        ← Back to services
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Edit service</h1>
      <ServiceForm service={service} error={error} />
    </div>
  );
}
