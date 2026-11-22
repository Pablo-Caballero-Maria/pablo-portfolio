/**
 * /serwist/sw.js (and its source map): the service worker, src/sw/worker.ts bundled by esbuild at
 * build time with the files to precache and the pages to download (Serwist's Turbopack
 * integration). Static: built once by `next build`, served from the CDN with
 * `Service-Worker-Allowed: /` so it can control the whole site.
 */
import { createSerwistRoute } from "@serwist/turbopack";

import { projects } from "@/content/projects";
import { OFFLINE_FALLBACK, offlinePages } from "@/sw/pages";
import { buildRevision } from "@/sw/revision";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "src/sw/worker.ts",
  useNativeEsbuild: true,
  additionalPrecacheEntries: [{ url: OFFLINE_FALLBACK, revision: buildRevision() }],
  // The photos and screenshots reach pages resized by next/image (/_next/image), not from public/,
  // and the CV is downloaded on demand: precaching them would only cost the visitor bandwidth.
  globIgnores: ["**/node_modules/**/*", "public/img/**/*", "public/*.pdf"],
  esbuildOptions: {
    // A classic script (not a module): every browser with service workers can run it.
    format: "iife",
    define: { __SW_PAGES__: JSON.stringify(offlinePages(projects.map((project) => project.slug))) },
  },
});
