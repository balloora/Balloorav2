"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_COOKIE,
  adminCookieOptions,
  isAdminAuthenticated,
  sessionToken,
  verifyPassword,
} from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "product-images";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------- Auth actions
export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), adminCookieOptions);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ------------------------------------------------------------- Product actions
async function uploadImages(slug: string, files: File[]): Promise<string[]> {
  const supabase = createAdminClient();
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slug || "product"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

export async function saveProduct(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "draft") as "draft" | "active" | "archived";
  const priceDollars = Number(formData.get("price") ?? 0);
  const inventory = Number(formData.get("inventory") ?? 0);

  if (!title) redirect(`/admin/products/${id || "new"}?error=${encodeURIComponent("Title is required")}`);

  const priceCents = Math.max(0, Math.round(priceDollars * 100));

  // Images kept from a previous save (checkboxes the admin left checked).
  const keptImages = formData.getAll("existing_images").map(String).filter(Boolean);
  const newFiles = formData.getAll("images").filter((v): v is File => v instanceof File);

  let uploaded: string[] = [];
  try {
    uploaded = await uploadImages(slug, newFiles);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Image upload failed";
    redirect(`/admin/products/${id || "new"}?error=${encodeURIComponent(msg)}`);
  }
  const images = [...keptImages, ...uploaded];
  const imageUrl = images[0] ?? null;

  const supabase = createAdminClient();
  const payload = {
    title,
    slug,
    description,
    category,
    status,
    price_cents: priceCents,
    inventory: Number.isFinite(inventory) ? Math.max(0, Math.trunc(inventory)) : 0,
    images,
    image_url: imageUrl,
  };

  let dbError: string | null = null;
  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    dbError = error?.message ?? null;
  } else {
    const { error } = await supabase.from("products").insert(payload);
    dbError = error?.message ?? null;
  }

  if (dbError) {
    redirect(`/admin/products/${id || "new"}?error=${encodeURIComponent(dbError)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/explore");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/explore");
  redirect("/admin");
}
