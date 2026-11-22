/// <reference lib="webworker" />
/**
 * The service worker (Serwist), built by src/app/serwist/[path]/route.ts into /serwist/sw.js and
 * registered by components/layout/ServiceWorker.tsx, so the site opens without a connection:
 *
 * - at install it precaches the build's scripts, styles and fonts, the world map, the icons and
 *   the offline page, and downloads every page (the list arrives as __SW_PAGES__ from the route);
 * - pages: network first, the cached copy when offline;
 * - the rest: Serwist's defaults for Next.js (static assets cache first; images, resized by
 *   next/image, stale-while-revalidate as they are seen…).
 */
import { defaultCache } from "@serwist/turbopack/worker";
import { NetworkFirst, Serwist, type PrecacheEntry, type SerwistGlobalConfig } from "serwist";

import { OFFLINE_FALLBACK, PAGES_CACHE } from "./pages";
import { isDocument, isPage } from "./requests";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
/** offlinePages() of the projects, written in by esbuild (route.ts → esbuildOptions.define). */
declare const __SW_PAGES__: string[];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: isPage,
      handler: new NetworkFirst({ cacheName: PAGES_CACHE, networkTimeoutSeconds: 5 }),
    },
    ...defaultCache,
  ],
  fallbacks: { entries: [{ url: OFFLINE_FALLBACK, matcher: isDocument }] },
});

/** Downloads every page; one that fails (a flaky connection) is cached on its first visit instead. */
async function cachePages(): Promise<void> {
  const cache = await caches.open(PAGES_CACHE);
  await Promise.allSettled(__SW_PAGES__.map((page) => cache.add(page)));
}

self.addEventListener("install", (event) => event.waitUntil(cachePages()));
serwist.addEventListeners();
