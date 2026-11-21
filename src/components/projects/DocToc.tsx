"use client";

import type { DocSection } from "@/content/projects";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

interface DocTocProps {
  sections: readonly Pick<DocSection, "id" | "title">[];
}

/** "On this page": links to the documentation's sections, marking the one being read. */
export function DocToc({ sections }: DocTocProps) {
  const active = useScrollSpy(
    sections.map((section) => section.id),
    "-20% 0px -70% 0px",
  );

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-[11px] tracking-wider text-muted uppercase">On this page</p>
      <ol className="mt-3 space-y-1 border-l border-line text-sm">
        {sections.map((section) => {
          const current = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1 pl-3 transition-colors ${current ? "border-project font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
