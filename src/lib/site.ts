/**
 * The site's public address, for absolute URLs in metadata, the sitemap and robots.txt.
 *
 * SITE_URL wins when set (e.g. a custom domain); on Vercel the production domain is used,
 * which Vercel provides to every build as VERCEL_PROJECT_PRODUCTION_URL; locally, localhost.
 */
export function siteUrl(env: Partial<Record<string, string>> = process.env): URL {
  if (env.SITE_URL) return new URL(env.SITE_URL);
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return new URL(`http://localhost:${env.PORT ?? 3000}`);
}
