"use client";

import { type ReactNode, useState } from "react";

interface ExperienceFilterProps<Id extends string> {
  filters: readonly { id: Id; label: string }[];
  counts: Record<Id, number>;
  /** The section heading, laid out next to the filter buttons. */
  heading: ReactNode;
  /** The timeline's <li> items, each with a data-cat attribute. */
  children: ReactNode;
}

/**
 * Filter buttons for the experience timeline. The items are rendered on the server; filtering
 * only sets data-filter on the list, and CSS (globals.css) dims the items of other categories.
 */
export function ExperienceFilter<Id extends string>({
  filters,
  counts,
  heading,
  children,
}: ExperienceFilterProps<Id>) {
  const [active, setActive] = useState<Id | undefined>(filters[0]?.id);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {heading}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter experience">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active === filter.id}
              onClick={() => setActive(filter.id)}
              className="rounded-full border border-line px-4 py-1.5 text-sm aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
            >
              {filter.label} <span className="num opacity-70">{counts[filter.id]}</span>
            </button>
          ))}
        </div>
      </div>
      <ol
        data-filter={active}
        className="timeline relative mt-10 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-line md:before:left-[11.5rem]"
      >
        {children}
      </ol>
    </>
  );
}
