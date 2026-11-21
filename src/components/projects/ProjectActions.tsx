import Link from "next/link";

import type { Project } from "@/content/projects";

import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { GitHubIcon } from "../ui/GitHubIcon";

const base =
  "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-offset-2";
const primary = `${base} bg-ink text-bg hover:opacity-90`;
const secondary = `${base} border border-line bg-bg hover:border-project`;

interface ProjectActionsProps {
  project: Project;
  /** Include the link to the documentation page (not needed on that page itself). */
  withDocs?: boolean;
  className?: string;
}

/** Visit the live site (deployed projects only), read the documentation, browse the code. */
export function ProjectActions({ project, withDocs = true, className = "" }: ProjectActionsProps) {
  const { deployment } = project;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {deployment.kind === "live" && (
        <a href={deployment.url} target="_blank" rel="noopener noreferrer" className={primary}>
          Visit site
          <ArrowUpRight className="h-4 w-4" />
          <span className="sr-only">(opens {project.name} in a new tab)</span>
        </a>
      )}
      {withDocs && (
        <Link
          href={`/projects/${project.slug}`}
          className={deployment.kind === "live" ? secondary : primary}
          aria-label={`Documentation for ${project.name}`}
        >
          <BookOpen className="h-4 w-4" />
          Documentation
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
      <a href={project.repository} target="_blank" rel="noopener noreferrer" className={secondary}>
        <GitHubIcon className="h-4 w-4" />
        Code
        <span className="sr-only">(source of {project.name} on GitHub, opens in a new tab)</span>
      </a>
    </div>
  );
}
