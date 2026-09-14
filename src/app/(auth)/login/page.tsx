"use client";

import { useActionState } from "react";

import { signInWithEmail, type AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInWithEmail, initialState);

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="text-2xl font-bold">Sign in to Balloora</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        We&apos;ll email you a magic link — no password required.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 w-full rounded-lg border px-3"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}
          />
        </div>

        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? "Sending…" : "Send magic link"}
        </Button>

        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        {state.message && <p className="text-sm text-green-600">{state.message}</p>}
      </form>
    </div>
  );
}
