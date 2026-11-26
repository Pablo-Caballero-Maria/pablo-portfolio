/**
 * The world map the globe draws (public/countries-110m.json, world-atlas's TopoJSON), loaded with
 * TanStack Query: downloaded once, when the globe first shows, together with the code that draws
 * it, and checked with zod before d3 trusts it.
 */
import { queryOptions } from "@tanstack/react-query";
import type { GeometryCollection, Topology } from "topojson-specification";
import { z } from "@/lib/zod";

export const WORLD_MAP_URL = "/countries-110m.json";

const geometryCollection = z.looseObject({
  type: z.literal("GeometryCollection"),
  geometries: z.array(z.looseObject({ type: z.string() })),
});

/** What the renderer relies on: a TopoJSON topology with a `countries` collection. */
export const worldMapSchema = z.looseObject({
  type: z.literal("Topology"),
  objects: z.looseObject({ countries: geometryCollection }),
  arcs: z.array(z.array(z.array(z.number()))),
  transform: z.optional(
    z.object({ scale: z.tuple([z.number(), z.number()]), translate: z.tuple([z.number(), z.number()]) }),
  ),
});

export type WorldMap = Topology<{ countries: GeometryCollection }>;

/** Downloads and checks the map; throws on an HTTP error or a file that isn't the expected map. */
export async function fetchWorldMap(fetchFn: typeof fetch = fetch): Promise<WorldMap> {
  const response = await fetchFn(WORLD_MAP_URL);
  if (!response.ok) throw new Error(`World map: HTTP ${response.status}`);
  // The schema checks the parts the renderer reads; topojson's own types describe the rest.
  return worldMapSchema.parse(await response.json()) as unknown as WorldMap;
}

/** The map and the renderer's code (d3-geo, topojson), fetched in parallel; never stale. */
export const globeQuery = queryOptions({
  queryKey: ["globe"],
  queryFn: async () => {
    const [{ GlobeRenderer }, world] = await Promise.all([import("./globe-renderer"), fetchWorldMap()]);
    return { GlobeRenderer, world };
  },
  staleTime: Infinity,
  gcTime: Infinity,
  retry: 1,
});
