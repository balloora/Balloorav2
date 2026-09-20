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
const rawClient = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} as const;

// Validate each public var independently and fall back per-field. This lets a
// partial setup (e.g. Supabase configured but Stripe not yet) keep the real
// values it does have, instead of discarding everything to placeholders.
type ClientKey = keyof typeof CLIENT_FALLBACK;
const missing: string[] = [];

function resolve(key: ClientKey, schema: z.ZodType<string>): { value: string; real: boolean } {
  const parsed = schema.safeParse(rawClient[key]);
  if (parsed.success) return { value: parsed.data, real: true };
  missing.push(key);
  return { value: CLIENT_FALLBACK[key], real: false };
}

const siteUrl = resolve("NEXT_PUBLIC_SITE_URL", z.string().url());
const supabaseUrl = resolve("NEXT_PUBLIC_SUPABASE_URL", z.string().url());
const supabaseAnon = resolve("NEXT_PUBLIC_SUPABASE_ANON_KEY", z.string().min(1));
const stripePk = resolve("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", z.string().min(1));

if (missing.length > 0) {
  console.warn(
    `⚠️  Missing or invalid public environment variables — using placeholders for these:\n` +
      missing.map((k) => `  - ${k}`).join("\n"),
  );
}

export const env = {
  NEXT_PUBLIC_SITE_URL: siteUrl.value,
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl.value,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon.value,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: stripePk.value,
} as const;

/** True when real Supabase public config is present (URL + anon key). */
export const isSupabaseConfigured = supabaseUrl.real && supabaseAnon.real;

/** True when a real Stripe publishable key is present. */
export const isStripeConfigured = stripePk.real;

/** Back-compat alias — the Explore data gate keys off Supabase being configured. */
export const isConfigured = isSupabaseConfigured;

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
