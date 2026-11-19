/**
 * The projects, in the order the home page shows them (deployed ones first), and lookups for
 * the documentation pages.
 */
import { milan } from "./milan";
import { molecula } from "./molecula";
import { piano } from "./piano";
import { sinophile } from "./sinophile";
import type { Project } from "./types";

export type { DocBlock, DocSection, Figure, Project } from "./types";

export const projects: readonly Project[] = [sinophile, piano, molecula, milan];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The projects before and after `slug`, wrapping around, for the page footer. */
export function getAdjacentProjects(slug: string): { previous: Project; next: Project } | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  const count = projects.length;
  return {
    previous: projects[(index - 1 + count) % count]!,
    next: projects[(index + 1) % count]!,
  };
}

/** The deployed site's address, or null for projects that only run locally. */
export function liveUrl(project: Project): string | null {
  return project.deployment.kind === "live" ? project.deployment.url : null;
}

/** "https://sinophile.vercel.app" → "sinophile.vercel.app". */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
