import type { Metadata } from "next";
import Link from "next/link";

import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "New Service" };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewServicePage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/services" className="text-gold-600 text-sm font-medium hover:underline">
        ← Back to services
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">New service</h1>
      <ServiceForm error={error} />
    </div>
  );
}
