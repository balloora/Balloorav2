import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Admin product form uploads images through a Server Action (default cap is 1 MB).
    // Images are compressed in the browser first; this is headroom for several at once.
    serverActions: { bodySizeLimit: "10mb" },
  },
  async redirects() {
    return [
      // The shop catalog now lives at /products.
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/explore", destination: "/products", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      // Supabase Storage public bucket images.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Common placeholder host used by the seed data. Remove in production.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
