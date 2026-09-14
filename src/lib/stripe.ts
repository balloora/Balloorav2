import "server-only";

import Stripe from "stripe";

import { serverEnv } from "@/lib/env";

let stripeSingleton: Stripe | null = null;

/**
 * Lazily-constructed server-side Stripe client. Instantiated on first use so
 * that missing keys fail loudly at request time (with a clear message) rather
 * than crashing the whole module graph at import time.
 */
export function getStripe(): Stripe {
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(serverEnv().STRIPE_SECRET_KEY, {
      // Pin the API version for predictable behavior across deploys.
      apiVersion: "2025-02-24.acacia",
      appInfo: {
        name: "Balloora",
      },
      typescript: true,
    });
  }
  return stripeSingleton;
}
