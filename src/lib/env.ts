import { z } from "zod";

/**
 * Runtime-validated environment variables.
 *
 * Client-safe values (prefixed with NEXT_PUBLIC_) are validated eagerly and can
 * be imported anywhere. Server-only secrets are exposed through `serverEnv()`,
 * which throws if accessed in the browser — keeping secrets out of client bundles.
 *
 * Missing/invalid PUBLIC config is treated as fail-soft: we log a loud warning
 * and fall back to inert placeholders so the app can still build and deploy
 * (pages degrade gracefully). Set the real values in your host's environment
 * (e.g. Vercel → Settings → Environment Variables) and redeploy to go live.
 */

// Inert, schema-valid fallbacks used only when real config is absent.
const CLIENT_FALLBACK = {
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_placeholder",
} as const;

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
});

function formatIssues(error: z.ZodError): string {
  return error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
}

// Next.js statically replaces `process.env.NEXT_PUBLIC_*` at build time, so these
// must be referenced explicitly (not via a dynamic key) to be inlined correctly.
const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
});

if (!parsedClient.success) {
  // Fail-soft: warn loudly but keep building/running with placeholders.
  console.warn(
    `⚠️  Missing or invalid public environment variables — using placeholders. ` +
      `Set these in your environment to enable Supabase/Stripe:\n${formatIssues(parsedClient.error)}`,
  );
}

export const env = parsedClient.success ? parsedClient.data : CLIENT_FALLBACK;

/** True when real public config is present (not running on placeholders). */
export const isConfigured = parsedClient.success;

let cachedServerEnv: z.infer<typeof serverSchema> | null = null;

/**
 * Access server-only secrets. Throws if called in the browser or if any secret
 * is missing/invalid. Call this inside server components, route handlers, and
 * server actions — never in client components.
 */
export function serverEnv(): z.infer<typeof serverSchema> {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() must not be called in the browser.");
  }
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  });

  if (!parsed.success) {
    throw new Error(
      `❌ Invalid or missing server environment variables:\n${formatIssues(parsed.error)}`,
    );
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}
