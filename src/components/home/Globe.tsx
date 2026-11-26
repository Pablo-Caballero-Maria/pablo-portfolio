"use client";

import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import { Skeleton } from "@/components/ui/Skeleton";
import type { Country } from "@/content/types";
import type { GlobeHover, GlobeRenderer } from "@/lib/globe/globe-renderer";
import { globeQuery } from "@/lib/globe/world-map";
import { fade } from "@/lib/motion";

export interface GlobeHandle {
  /** Turns the globe to face a country. */
  focus: (id: string) => void;
}

interface GlobeProps {
  countries: readonly Country[];
  activeId: string;
  onSelect: (id: string) => void;
  ref?: Ref<GlobeHandle>;
}

interface Tooltip {
  country: Country;
  x: number;
  y: number;
}

const TOOLTIP_WIDTH = 256;

/**
 * The spinning globe. d3-geo, topojson and the world map (public/countries-110m.json) are only
 * downloaded once this component mounts (globeQuery, TanStack Query), so they never weigh on the
 * first load of the page. If they can't load, the list of countries next to it still works.
 */
export function Globe({ countries, activeId, onSelect, ref }: GlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<GlobeRenderer | null>(null);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const globe = useQuery(globeQuery);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (globe.error) console.error(globe.error);
  }, [globe.error]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!globe.data || !svg) return;
    const byId = new Map(countries.map((country) => [country.id, country]));

    function showTooltip(hover: GlobeHover | null) {
      const wrapper = wrapperRef.current;
      const country = hover && byId.get(hover.id);
      if (!hover || !country || !wrapper) {
        setTooltip(null);
        return;
      }
      const box = wrapper.getBoundingClientRect();
      const x = Math.max(4, Math.min(hover.clientX - box.left + 14, box.width - TOOLTIP_WIDTH - 4));
      setTooltip({ country, x, y: hover.clientY - box.top + 14 });
    }

    const { GlobeRenderer, world } = globe.data;
    rendererRef.current = new GlobeRenderer({
      svg,
      world,
      countries,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onSelect: (id) => onSelectRef.current(id),
      onHover: showTooltip,
    });
    setReady(true);
    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
      setReady(false);
    };
  }, [countries, globe.data]);

  useEffect(() => {
    rendererRef.current?.mark(activeId);
  }, [activeId, ready]);

  useImperativeHandle(ref, () => ({ focus: (id) => rendererRef.current?.focus(id) }), []);

  if (globe.isError) {
    return (
      <p className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
        The globe could not load. The list of countries still works.
      </p>
    );
  }

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-[30rem]">
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="globe block h-auto w-full"
        role="img"
        aria-label={`Rotating globe highlighting the ${countries.length} countries Pablo has studied, worked or travelled in`}
        data-ready={ready || undefined}
      />
      {/* Skeleton loader while d3-geo and the world map download. */}
      {!ready && <Skeleton className="absolute inset-[4%] rounded-full" />}
      <AnimatePresence>
        {tooltip && (
          <m.div
            key="tooltip"
            {...fade}
            className="pointer-events-none absolute top-0 left-0 z-10 rounded-lg border border-line bg-surface p-3 text-sm shadow-lg"
            style={{ maxWidth: TOOLTIP_WIDTH, x: tooltip.x, y: tooltip.y }}
            role="tooltip"
          >
            <p className="font-display font-bold">{tooltip.country.name}</p>
            <p className="mt-1 text-muted">{tooltip.country.text}</p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
