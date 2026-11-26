/**
 * TanStack Query's client for the site. Everything it loads is static (it changes only with a
 * new deployment), so nothing is refetched on focus or reconnection; a failed download is
 * retried once.
 */
import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity, refetchOnWindowFocus: false, refetchOnReconnect: false, retry: 1 },
    },
  });
}
