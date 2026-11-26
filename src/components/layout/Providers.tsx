"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { type ReactNode, useState } from "react";

import { makeQueryClient } from "@/lib/query-client";

import { ServiceWorker } from "./ServiceWorker";

/**
 * What every page runs inside: TanStack Query's client, motion (only its basic animation features,
 * loaded once; none at all for visitors who prefer reduced motion) and the service worker.
 */
export function Providers({ children }: { children: ReactNode }) {
  // One client per browser tab, created on first render (not shared between server requests).
  const [queryClient] = useState(makeQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          <ServiceWorker>{children}</ServiceWorker>
        </LazyMotion>
      </MotionConfig>
    </QueryClientProvider>
  );
}
