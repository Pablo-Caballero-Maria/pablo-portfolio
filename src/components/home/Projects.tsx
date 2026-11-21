import { projects } from "@/content/projects";

import { ProjectCard } from "../projects/ProjectCard";
import { SectionHeading } from "../ui/SectionHeading";

/** The projects grid on the home page; each card links to its documentation page. */
export function Projects() {
  const live = projects.filter((project) => project.deployment.kind === "live").length;

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-b border-line">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[60ch]">
            <SectionHeading id="projects-title" eyebrow="Projects" title="Things I've built" />
            <p className="mt-3 text-muted">
              Three live web apps (one of them a neural network that reads the heart) and two data studies
              from university coursework. Each one has a short write-up of what it does, how it&apos;s built
              and what came out of it.
            </p>
          </div>
          <p className="flex flex-wrap gap-4 font-mono text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-live" aria-hidden="true" />
              {live} live
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-muted" aria-hidden="true" />
              {projects.length - live} run locally
            </span>
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
