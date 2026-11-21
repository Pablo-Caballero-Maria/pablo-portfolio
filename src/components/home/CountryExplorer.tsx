"use client";

import { useRef, useState } from "react";

import type { Country } from "@/content/types";

import { Globe, type GlobeHandle } from "./Globe";

interface CountryExplorerProps {
  countries: readonly Country[];
}

/** The globe and the list of countries, kept in sync: picking either one shows its story. */
export function CountryExplorer({ countries }: CountryExplorerProps) {
  const [activeId, setActiveId] = useState(countries[0]?.id ?? "");
  const globe = useRef<GlobeHandle>(null);
  const active = countries.find((country) => country.id === activeId);

  return (
    <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Globe ref={globe} countries={countries} activeId={activeId} onSelect={setActiveId} />
      <div>
        <div className="mb-4 flex flex-wrap gap-4 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-accent" aria-hidden="true" />
            Studied or worked
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-warm" aria-hidden="true" />
            Travelled
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-2" aria-label="Countries">
          {countries.map((country) => (
            <li key={country.id}>
              <button
                type="button"
                aria-pressed={country.id === activeId}
                onClick={() => {
                  setActiveId(country.id);
                  globe.current?.focus(country.id);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-left text-sm hover:border-accent aria-pressed:border-ink aria-pressed:bg-surface"
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-sm ${country.kind === "work" ? "bg-accent" : "bg-warm"}`}
                  aria-hidden="true"
                />
                {country.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 min-h-[5.5rem] rounded-xl border border-line bg-surface p-4" aria-live="polite">
          {active && (
            <>
              <p className="font-display font-bold">{active.name}</p>
              <p className="mt-1 text-sm text-muted">{active.text}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
