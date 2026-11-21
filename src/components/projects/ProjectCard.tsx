import Link from "next/link";

import type { Project } from "@/content/projects";

import { TagList } from "../ui/TagList";
import { ProjectActions } from "./ProjectActions";
import { projectHueStyle } from "./project-hue";
import { ProjectVisual } from "./ProjectVisual";

interface ProjectCardProps {
  project: Project;
}

/** A project on the home page: cover, what it is, three key figures, stack and links. */
export function ProjectCard({ project }: ProjectCardProps) {
  const titleId = `project-${project.slug}`;
  return (
    <article
      aria-labelledby={titleId}
      style={projectHueStyle(project)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--project)_45%,var(--line))] hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)]"
    >
      <ProjectVisual
        project={project}
        sizes="(min-width: 1024px) 34rem, (min-width: 640px) 90vw, 100vw"
        className="aspect-[16/10] border-b border-line"
      />
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] tracking-wider text-project uppercase">
          {project.kind} · {project.year}
        </p>
        <h3 id={titleId} className="mt-1.5 font-display text-2xl font-bold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-project">
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-muted">{project.tagline}</p>

        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
          {project.highlights.map((highlight) => (
            <div key={highlight.label} className="flex flex-col-reverse bg-bg px-3 py-3">
              <dt className="mt-0.5 text-[11px] leading-snug text-muted">{highlight.label}</dt>
              <dd className="num font-display text-xl font-bold text-project">{highlight.value}</dd>
            </div>
          ))}
        </dl>

        <TagList tags={project.stack} label="Built with" className="mt-5" />

        <div className="mt-auto pt-6">
          {project.deployment.kind === "local" && (
            <p className="mb-3 font-mono text-[11px] text-muted">{project.deployment.note}</p>
          )}
          <ProjectActions project={project} />
        </div>
      </div>
    </article>
  );
}
