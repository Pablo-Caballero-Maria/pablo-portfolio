import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocSectionView } from "@/components/projects/DocBlocks";
import { DocToc } from "@/components/projects/DocToc";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { projectHueStyle } from "@/components/projects/project-hue";
import { ProjectPager } from "@/components/projects/ProjectPager";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { ArrowLeft } from "lucide-react";
import { TagList } from "@/components/ui/TagList";
import { displayUrl, getAdjacentProjects, getProject, projects } from "@/content/projects";

/** One page per project, all prerendered; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.name,
      description: project.summary,
      images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height }],
    },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  const adjacent = getAdjacentProjects(slug);
  if (!project || !adjacent) notFound();

  const { deployment } = project;

  return (
    <article style={projectHueStyle(project)} aria-labelledby="project-title">
      <header className="border-b border-line">
        <div className="mx-auto max-w-page px-4 pt-10 sm:px-6 md:pt-14">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All projects
          </Link>
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div className="reveal pb-2 lg:pb-14">
              <p className="font-mono text-xs tracking-[.12em] text-project uppercase">
                {project.kind} · {project.year}
              </p>
              <h1
                id="project-title"
                className="mt-3 font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl"
              >
                {project.name}
              </h1>
              <p className="mt-5 max-w-[46ch] text-xl text-muted">{project.tagline}</p>
              <ProjectActions project={project} withDocs={false} className="mt-8" />
              <p className="mt-4 font-mono text-xs text-muted">
                {deployment.kind === "live" ? (
                  <>
                    Live at{" "}
                    <a
                      href={deployment.url}
                      className="text-project hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {displayUrl(deployment.url)}
                    </a>
                  </>
                ) : (
                  deployment.note
                )}
              </p>
            </div>
            <ProjectVisual
              project={project}
              preload
              sizes="(min-width: 1024px) 38rem, 100vw"
              className="reveal reveal-2 aspect-[16/11] rounded-t-2xl border border-b-0 border-line"
            />
          </div>
        </div>
      </header>

      <div className="border-b border-line bg-surface">
        <dl className="mx-auto grid max-w-page gap-px bg-line sm:grid-cols-3">
          {project.highlights.map((highlight) => (
            <div key={highlight.label} className="flex flex-col-reverse bg-surface px-4 py-6 sm:px-6">
              <dt className="mt-1 text-sm text-muted">{highlight.label}</dt>
              <dd className="num font-display text-4xl font-bold text-project">{highlight.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid max-w-page gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <DocToc sections={project.sections} />
          <div className="mt-8">
            <p className="font-mono text-[11px] tracking-wider text-muted uppercase">Built with</p>
            <TagList tags={project.stack} label="Built with" className="mt-3" />
          </div>
        </aside>

        <div className="max-w-[46rem] min-w-0">
          <p className="text-lg leading-relaxed">{project.summary}</p>
          <div className="mt-12 space-y-16">
            {project.sections.map((section) => (
              <DocSectionView key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-surface">
        <div className="mx-auto max-w-page px-4 py-12 sm:px-6">
          <ProjectPager previous={adjacent.previous} next={adjacent.next} />
        </div>
      </div>
    </article>
  );
}
