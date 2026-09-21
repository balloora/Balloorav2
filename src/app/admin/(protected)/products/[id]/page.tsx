import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditProductPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = createAdminClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin" className="text-gold-600 text-sm font-medium hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Edit product</h1>
      <ProductForm product={product} error={error} />
    </div>
  );
}
