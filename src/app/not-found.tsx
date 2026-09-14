import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl" aria-hidden>
        🎈
      </p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2" style={{ color: "var(--muted)" }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="mt-6 inline-block">
        <Button>Back to marketplace</Button>
      </Link>
    </div>
  );
}
