import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Web Analytics (page views, cookieless) and Speed Insights (Core Web Vitals of real
 * visits). Rendered only in builds made by Vercel (`VERCEL=1` at build time): elsewhere their
 * scripts (`/_vercel/…`) don't exist, so local runs and CI stay free of 404s.
 */
export function VercelTelemetry() {
  if (!process.env.VERCEL) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
