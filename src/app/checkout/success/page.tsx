"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  // The order is fulfilled server-side by the Stripe webhook. Here we just
  // clear the local cart once the buyer lands back on the success page.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="text-5xl" aria-hidden>
        🎉
      </div>
      <h1 className="mt-4 text-2xl font-bold">Thank you for your order!</h1>
      <p className="mt-2" style={{ color: "var(--muted)" }}>
        Your payment was received and your order is being processed. A receipt has been sent to your
        email.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/account">
          <Button variant="secondary">View my orders</Button>
        </Link>
        <Link href="/">
          <Button>Keep shopping</Button>
        </Link>
      </div>
    </div>
  );
}
