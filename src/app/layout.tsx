import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";

import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/lib/cart-context";
import { env } from "@/lib/env";

import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Balloora Events — Balloons, Flowers & Event Decor",
    template: "%s · Balloora Events",
  },
  description:
    "Balloons, flowers, and bespoke event decor for birthdays, baby showers, weddings, and every special occasion. Beautiful moments start with Balloora.",
  openGraph: {
    title: "Balloora Events",
    description: "Balloons, flowers & bespoke event decor for every special occasion.",
    siteName: "Balloora Events",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} min-h-screen antialiased`}>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
