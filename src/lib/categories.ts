import "server-only";

import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

import { env, isSupabaseConfigured } from "@/lib/env";
import type { Category, Database } from "@/types/database.types";

/**
 * Product categories, managed in the admin panel. `slug` maps to
 * /products?occasion=<slug>; products.category stores the `name`.
 * Deduplicated per request with React `cache`. Uses a cookie-less anon client
 * (categories are public) so pages that only need categories can stay static.
 */
export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured) return [];
  const supabase = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return data ?? [];
});
