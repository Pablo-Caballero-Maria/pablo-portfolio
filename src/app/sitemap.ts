import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

/** /sitemap.xml: the home page and every project's documentation. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: new URL("/", base).href, priority: 1 },
    ...projects.map((project) => ({ url: new URL(`/projects/${project.slug}`, base).href, priority: 0.8 })),
  ];
}
