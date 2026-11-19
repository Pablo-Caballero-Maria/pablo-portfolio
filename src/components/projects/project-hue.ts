import type { CSSProperties } from "react";

import type { Project } from "@/content/projects";

/**
 * Sets a project's hue (the --hue-<name> token of globals.css) as --project, which the
 * `text-project`, `bg-project`, `border-project` utilities and `.project-stage` read.
 */
export function projectHueStyle(project: Pick<Project, "hue">): CSSProperties {
  return { "--project": `var(--hue-${project.hue})` } as CSSProperties;
}
