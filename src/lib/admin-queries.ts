import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Products that will actually appear in the homepage Shop preview: ticked,
 * active, and with a cover photo. Optionally excludes one product (the one
 * being edited, whose checkbox state the form tracks itself).
 */
export async function countHomepageProducts(excludeId?: string): Promise<number> {
  let query = createAdminClient()
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("show_on_homepage", true)
    .eq("status", "active")
    .not("image_url", "is", null);
  if (excludeId) query = query.neq("id", excludeId);
  const { count } = await query;
  return count ?? 0;
}
