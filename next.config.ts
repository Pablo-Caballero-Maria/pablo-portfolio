/**
 * Next.js configuration.
 *
 * Every route is prerendered at build time (the home page and one documentation page per
 * project), so Vercel serves plain HTML from its CDN. The only runtime work is `next/image`
 * resizing the photos and screenshots into AVIF/WebP for each screen width.
 *
 * The styles are Tailwind CSS v4 (src/app/globals.css), compiled by its Turbopack loader.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // The images live in public/ and never change under the same name: cache them for 31 days.
    minimumCacheTTL: 2_678_400,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
