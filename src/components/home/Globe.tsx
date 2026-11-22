"use client";

import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import type { Country } from "@/content/types";
import type { GlobeHover, GlobeRenderer } from "@/lib/globe/globe-renderer";

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
 * downloaded once this component mounts, so they never weigh on the first load of the page.
 * If they can't load, the list of countries next to it still works.
 */
export function Globe({ countries, activeId, onSelect, ref }: GlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<GlobeRenderer | null>(null);
  const onSelectRef = useRef(onSelect);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
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

    async function load() {
      try {
        const [{ GlobeRenderer }, world] = await Promise.all([
          import("@/lib/globe/globe-renderer"),
          fetch("/countries-110m.json").then((response) => {
            if (!response.ok) throw new Error(`World map: HTTP ${response.status}`);
            return response.json();
          }),
        ]);
        if (cancelled || !svgRef.current) return;
        rendererRef.current = new GlobeRenderer({
          svg: svgRef.current,
          world,
          countries,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onSelect: (id) => onSelectRef.current(id),
          onHover: showTooltip,
        });
        setReady(true);
      } catch (error) {
        console.error(error);
        if (!cancelled) setFailed(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [countries]);

  useEffect(() => {
    rendererRef.current?.mark(activeId);
  }, [activeId, ready]);

  useImperativeHandle(ref, () => ({ focus: (id) => rendererRef.current?.focus(id) }), []);

  if (failed) {
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
      {tooltip && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-10 rounded-lg border border-line bg-surface p-3 text-sm shadow-lg"
          style={{ maxWidth: TOOLTIP_WIDTH, transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }}
          role="tooltip"
        >
          <p className="font-display font-bold">{tooltip.country.name}</p>
          <p className="mt-1 text-muted">{tooltip.country.text}</p>
        </div>
      )}
    </div>
  );
}
