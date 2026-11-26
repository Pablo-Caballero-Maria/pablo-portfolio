/**
 * Next.js configuration.
 *
 * Every route is prerendered at build time (the home page and one documentation page per
 * project), so Vercel serves plain HTML from its CDN. The only runtime work is `next/image`
 * resizing the photos and screenshots into AVIF/WebP for each screen width.
 *
 * The styles are Tailwind CSS v4 (src/app/globals.css), compiled by its Turbopack loader.
 * withSerwist keeps esbuild, which builds the service worker (src/app/serwist/[path]/route.ts),
 * out of the server bundle.
 *
 * Every response carries the security headers of src/lib/security-headers.ts (Content Security
 * Policy, HSTS, no framing…).
 */
import { withSerwist } from "@serwist/turbopack";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

import { deploymentOptions, securityHeaders } from "./src/lib/security-headers";

const baseConfig = (phase: string): NextConfig => ({
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const options = { ...deploymentOptions(), dev: phase === PHASE_DEVELOPMENT_SERVER };
    return [{ source: "/(.*)", headers: securityHeaders(options) }];
  },
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
});

/** Next.js calls this with the phase it runs in (`next dev`, `next build`, `next start`…). */
const nextConfig = (phase: string): NextConfig => withSerwist(baseConfig(phase));

export default nextConfig;
