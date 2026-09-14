import { redirect } from "next/navigation";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Your account" };

const statusLabels: Record<string, string> = {
  pending: "Pending payment",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // `middleware.ts` already guards this route, but guard again defensively.
  if (!user) redirect("/login?redirectTo=/account");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_cents, currency, created_at")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your account</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {user.email}
          </p>
        </div>
        <form action={signOut}>
          <Button variant="secondary">Sign out</Button>
        </form>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Order history</h2>
        {!orders || orders.length === 0 ? (
          <p
            className="rounded-lg border p-4 text-sm"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            You haven&apos;t placed any orders yet.
          </p>
        ) : (
          <ul className="divide-y rounded-xl border" style={{ borderColor: "var(--border)" }}>
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-mono text-sm">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total_cents, order.currency)}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {statusLabels[order.status] ?? order.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
