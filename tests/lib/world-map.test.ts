import { describe, expect, it, vi } from "vitest";

import { WORLD_MAP_URL, fetchWorldMap, worldMapSchema } from "@/lib/globe/world-map";

const topology = {
  type: "Topology",
  arcs: [
    [
      [0, 0],
      [1, 1],
    ],
  ],
  transform: { scale: [0.1, 0.1], translate: [-180, -90] },
  objects: {
    countries: { type: "GeometryCollection", geometries: [{ type: "Polygon", id: "724", arcs: [[0]] }] },
  },
};

const respond = (body: unknown, status = 200) =>
  vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("fetchWorldMap", () => {
  it("downloads the map and keeps what it has beyond the schema", async () => {
    const fetchFn = respond(topology);
    const world = await fetchWorldMap(fetchFn);
    expect(fetchFn).toHaveBeenCalledWith(WORLD_MAP_URL);
    expect(world.objects.countries.geometries[0]).toMatchObject({ id: "724" });
  });

  it("fails on an HTTP error", async () => {
    await expect(fetchWorldMap(respond({}, 404))).rejects.toThrow("World map: HTTP 404");
  });

  it("rejects a file that isn't a topology of countries", async () => {
    await expect(fetchWorldMap(respond({ type: "FeatureCollection" }))).rejects.toThrow();
    expect(worldMapSchema.safeParse({ ...topology, objects: {} }).success).toBe(false);
  });
});
