import Link from "next/link";

import type { Project } from "@/content/projects";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { projectHueStyle } from "./project-hue";

interface ProjectPagerProps {
  previous: Project;
  next: Project;
}

function PagerLink({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={projectHueStyle(project)}
      className={`group flex flex-col rounded-xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-project ${isNext ? "items-end text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-muted uppercase">
        {!isNext && <ArrowLeft className="h-3.5 w-3.5" />}
        {isNext ? "Next project" : "Previous project"}
        {isNext && <ArrowRight className="h-3.5 w-3.5" />}
      </span>
      <span className="mt-1.5 font-display text-xl font-bold group-hover:text-project">{project.name}</span>
      <span className="mt-1 line-clamp-2 text-sm text-muted">{project.tagline}</span>
    </Link>
  );
}

/** Links to the previous and next projects at the end of a documentation page. */
export function ProjectPager({ previous, next }: ProjectPagerProps) {
  return (
    <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
      <PagerLink project={previous} direction="previous" />
      <PagerLink project={next} direction="next" />
    </nav>
  );
}
