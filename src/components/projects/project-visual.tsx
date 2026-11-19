import Image from "next/image";

import { displayUrl, liveUrl } from "@/content/projects";
import type { Project } from "@/content/projects";

import { TerminalIcon } from "../ui/icons";

interface ProjectVisualProps {
  project: Project;
  /** `sizes` for next/image: how wide the frame is drawn at each breakpoint. */
  sizes: string;
  preload?: boolean;
  className?: string;
}

/**
 * A project's cover rising from its tinted stage: in a browser window (with the site's address)
 * for deployed apps, or on a sheet labelled as a figure for work that only runs locally.
 */
export function ProjectVisual({ project, sizes, preload = false, className = "" }: ProjectVisualProps) {
  const url = liveUrl(project);

  return (
    <div className={`project-stage relative overflow-hidden ${className}`}>
      <StatusBadge project={project} className="absolute top-3 right-3 z-10" />
      <div className="absolute inset-x-5 top-12 bottom-0 sm:inset-x-8 sm:top-14">
        <div className="h-full overflow-hidden rounded-t-xl border border-b-0 border-line bg-surface shadow-[0_18px_50px_-20px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <div className="flex h-8 items-center gap-2 border-b border-line bg-raised px-3">
            {url ? (
              <>
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="mx-auto truncate rounded-md bg-surface px-3 py-0.5 font-mono text-[11px] text-muted">
                  {displayUrl(url)}
                </span>
                <span className="w-[42px]" aria-hidden="true" />
              </>
            ) : (
              <span className="flex items-center gap-1.5 truncate font-mono text-[11px] text-muted">
                <TerminalIcon className="h-3.5 w-3.5 text-project" />
                {project.repository.split("/").pop()} · results
              </span>
            )}
          </div>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes={sizes}
            preload={preload}
            className="w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  project: Project;
  className?: string;
}

/** "Live" with a pulsing dot for deployed projects, "Not deployed" for local ones. */
export function StatusBadge({ project, className = "" }: StatusBadgeProps) {
  const live = project.deployment.kind === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-2.5 py-1 font-mono text-[11px] font-medium backdrop-blur ${className}`}
    >
      {live ? (
        <>
          <span className="live-dot h-2 w-2 rounded-full bg-live text-live" aria-hidden="true" />
          Live
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full border border-muted" aria-hidden="true" />
          Not deployed
        </>
      )}
    </span>
  );
}
