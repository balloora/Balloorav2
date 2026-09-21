import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

/**
 * Lightweight single-password gate for the /admin area.
 *
 * The admin signs in with ADMIN_PASSWORD. On success we set an httpOnly cookie
 * containing an HMAC token; it can't be forged without the secret, and rotating
 * ADMIN_PASSWORD (or ADMIN_SESSION_SECRET) instantly invalidates old sessions.
 *
 * This is intentionally simple — a shared admin password, not per-user auth.
 */

export const ADMIN_COOKIE = "balloora_admin";
const SESSION_PAYLOAD = "balloora-admin-session-v1";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function adminPassword(): string | undefined {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : undefined;
}

/** True when ADMIN_PASSWORD is configured (otherwise login is disabled). */
export function isAdminConfigured(): boolean {
  return adminPassword() !== undefined;
}

function sessionSecret(): string {
  // Prefer a dedicated secret; fall back to the password so a session is still
  // signed even if ADMIN_SESSION_SECRET isn't set.
  return process.env.ADMIN_SESSION_SECRET || adminPassword() || "balloora-insecure-dev-secret";
}

/** The signed token stored in the cookie for an authenticated admin. */
export function sessionToken(): string {
  return createHmac("sha256", sessionSecret()).update(SESSION_PAYLOAD).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Constant-time check of a submitted password against ADMIN_PASSWORD. */
export function verifyPassword(input: string): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  return safeEqual(input, pw);
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

/** Reads the admin cookie and verifies its signature. */
export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, sessionToken());
}
