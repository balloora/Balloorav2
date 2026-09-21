import type { Metadata } from "next";
import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New Product" };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewProductPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin" className="text-gold-600 text-sm font-medium hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">New product</h1>
      <ProductForm error={error} />
    </div>
  );
}
