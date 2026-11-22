/**
 * The pages the service worker downloads when it installs, so the whole site opens without a
 * connection even before a page was visited: the home page and each project's page.
 */
export function offlinePages(projectSlugs: readonly string[]): string[] {
  return ["/", ...projectSlugs.map((slug) => `/projects/${slug}`)];
}

/** Shown for a page that isn't in the cache while offline (src/app/~offline/page.tsx). */
export const OFFLINE_FALLBACK = "/~offline";

/** Cache of the pages (network first: online, a page is always the newest). */
export const PAGES_CACHE = "pages";
