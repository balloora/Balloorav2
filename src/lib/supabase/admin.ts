import "server-only";

import { createClient } from "@supabase/supabase-js";

import { env, supabaseServiceRoleKey } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Privileged Supabase client using the service_role key. Bypasses Row Level
 * Security — use ONLY in trusted server contexts (e.g. Stripe webhooks writing
 * orders on behalf of the system). Never import this into client code.
 */
export function createAdminClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
