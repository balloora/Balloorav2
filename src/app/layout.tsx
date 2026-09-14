import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/lib/cart-context";
import { env } from "@/lib/env";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Balloora — Marketplace",
    template: "%s · Balloora",
  },
  description: "Discover and buy from independent sellers on Balloora.",
  openGraph: {
    title: "Balloora",
    description: "Discover and buy from independent sellers on Balloora.",
    siteName: "Balloora",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} min-h-screen antialiased`}>
        <CartProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
          <footer
            className="mt-16 border-t py-8 text-center text-sm"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <p>© {new Date().getFullYear()} Balloora. Built with Next.js, Supabase &amp; Stripe.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
