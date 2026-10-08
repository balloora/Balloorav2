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
const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
};

async function uploadImages(slug: string, files: File[], folder = ""): Promise<string[]> {
  const supabase = createAdminClient();
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}${slug || "product"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type || MIME_BY_EXT[ext] || "application/octet-stream",
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
  const showOnHomepage = formData.get("show_on_homepage") === "on";

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
    show_on_homepage: showOnHomepage,
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
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/products");
  redirect("/admin");
}

// ------------------------------------------------------------- Service actions
export async function saveService(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  const back = `/admin/services/${id || "new"}`;
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const text = (key: string) => String(formData.get(key) ?? "").trim() || null;
  const status = String(formData.get("status") ?? "draft") as "draft" | "active" | "archived";

  if (!title) redirect(`${back}?error=${encodeURIComponent("Title is required")}`);

  // Optional numbers: blank means "not set" (price on request / no capacity).
  const priceRaw = String(formData.get("price_from") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const priceFromCents = priceRaw ? Math.max(0, Math.round(Number(priceRaw) * 100)) : null;
  const capacity = capacityRaw ? Math.max(1, Math.trunc(Number(capacityRaw))) : null;

  const keptImages = formData.getAll("existing_images").map(String).filter(Boolean);
  const newFiles = formData.getAll("images").filter((v): v is File => v instanceof File);

  let uploaded: string[] = [];
  try {
    uploaded = await uploadImages(slug, newFiles, "services/");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Image upload failed";
    redirect(`${back}?error=${encodeURIComponent(msg)}`);
  }
  const images = [...keptImages, ...uploaded];

  const supabase = createAdminClient();
  const payload = {
    title,
    slug,
    service_type: text("service_type") ?? "Other",
    summary: text("summary"),
    description: text("description"),
    location: text("location"),
    price_from_cents: Number.isFinite(priceFromCents) ? priceFromCents : null,
    capacity: Number.isFinite(capacity) ? capacity : null,
    status,
    images,
    image_url: images[0] ?? null,
  };

  const { error } = id
    ? await supabase.from("services").update(payload).eq("id", id)
    : await supabase.from("services").insert(payload);

  if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = createAdminClient();
  await supabase.from("services").delete().eq("id", id);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

// ------------------------------------------------------------ Category actions
// Products reference categories by name (FK with ON UPDATE CASCADE / ON DELETE
// SET NULL), so renames and deletes are reflected on products by the database.
function revalidateCategories() {
  revalidatePath("/", "layout");
}

function categoriesError(message: string): never {
  redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
}

function friendlyCategoryError(message: string, name: string): string {
  return message.includes("duplicate key") ? `A category named “${name}” already exists.` : message;
}

export async function createCategory(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) categoriesError("Category name is required");

  const supabase = createAdminClient();
  // New categories go to the end of the list.
  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name) || `category-${Date.now()}`,
    sort_order: (last?.sort_order ?? 0) + 10,
  });
  if (error) categoriesError(friendlyCategoryError(error.message, name));

  revalidateCategories();
  redirect("/admin/categories");
}

export async function renameCategory(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!id) return;
  if (!name) categoriesError("Category name can't be empty");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(name) || `category-${Date.now()}` })
    .eq("id", id);
  if (error) categoriesError(friendlyCategoryError(error.message, name));

  revalidateCategories();
  redirect("/admin/categories");
}

export async function moveCategory(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  const direction = String(formData.get("direction") ?? "");
  if (!id || (direction !== "up" && direction !== "down")) return;

  const supabase = createAdminClient();
  const { data: list } = await supabase
    .from("categories")
    .select("id")
    .order("sort_order")
    .order("name");
  const ids = (list ?? []).map((c) => c.id);
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= ids.length) return;

  // Swap, then rewrite every sort_order so the order is always clean (10, 20, …).
  const moved = ids.splice(from, 1)[0] as string;
  ids.splice(to, 0, moved);
  await Promise.all(
    ids.map((cid, i) => supabase.from("categories").update({ sort_order: (i + 1) * 10 }).eq("id", cid)),
  );

  revalidateCategories();
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) categoriesError(error.message);

  revalidateCategories();
  revalidatePath("/admin");
  redirect("/admin/categories");
}
