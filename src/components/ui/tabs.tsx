"use client";

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

import { wrapIndex } from "@/lib/cycle";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

interface TabsProps {
  label: string;
  tabs: readonly TabItem[];
  /** Laid out on the left of the tab buttons (e.g. the section heading). */
  heading?: ReactNode;
}

/**
 * Accessible tabs (WAI-ARIA tabs pattern): ← → Home End move between tabs, only the selected
 * tab is in the tab order, and every panel is rendered so its content is in the HTML.
 */
export function Tabs({ label, tabs, heading }: TabsProps) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  function select(index: number) {
    const next = wrapIndex(index, tabs.length);
    setSelected(next);
    buttons.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowLeft: selected - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {heading}
        <div
          className="flex rounded-lg border border-line bg-surface p-1 text-sm"
          role="tablist"
          aria-label={label}
          onKeyDown={onKeyDown}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-controls={`${baseId}-panel-${tab.id}`}
              aria-selected={index === selected}
              tabIndex={index === selected ? 0 : -1}
              onClick={() => setSelected(index)}
              className="rounded-md px-4 py-1.5 font-medium text-muted aria-selected:bg-ink aria-selected:text-bg"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== selected}
          tabIndex={0}
          className="mt-10 focus-visible:outline-offset-8"
        >
          {tab.panel}
        </div>
      ))}
    </>
  );
}
