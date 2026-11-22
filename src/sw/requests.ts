/**
 * Which requests the service worker (worker.ts) handles how. Pure functions of the request, so they
 * are tested without a service worker.
 */

/** What Serwist gives each runtime-caching matcher (the part used here). */
export interface RequestInfo {
  url: URL;
  request: Pick<Request, "mode" | "destination">;
  sameOrigin: boolean;
}

/** Opening or reloading one of the site's pages. */
export const isPage = ({ request, sameOrigin }: RequestInfo): boolean =>
  sameOrigin && request.mode === "navigate";

/** The fallback page is for documents only (a missing image or script just fails). */
export const isDocument = ({ request }: Pick<RequestInfo, "request">): boolean =>
  request.destination === "document";
