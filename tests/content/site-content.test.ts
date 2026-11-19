import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { awards, languages } from "@/content/education";
import { experience } from "@/content/experience";
import { navigation, profile, stats } from "@/content/profile";
import { countries, photos } from "@/content/world";

import { imageSize, publicFile } from "../helpers/image-size";

describe("navigation", () => {
  it("lists each section once, Projects included", () => {
    const ids = navigation.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("projects");
  });
});

describe("countries", () => {
  const world = JSON.parse(readFileSync(publicFile("/countries-110m.json"), "utf8")) as {
    objects: { countries: { geometries: { id?: string }[] } };
  };
  const mapIds = new Set(world.objects.countries.geometries.map((geometry) => geometry.id));

  it("are all on the world map, so the globe can highlight them", () => {
    for (const country of countries) expect(mapIds.has(country.id), country.name).toBe(true);
  });

  it("match the headline count", () => {
    expect(stats.find((stat) => stat.label === "Countries")?.value).toBe(String(countries.length));
  });

  it("are unique", () => {
    expect(new Set(countries.map((country) => country.id)).size).toBe(countries.length);
  });
});

describe("images", () => {
  it.each([profile.portrait, ...photos].map((image) => [image.src, image] as const))(
    "%s exists with its declared size",
    (src, image) => {
      expect(existsSync(publicFile(src))).toBe(true);
      expect(imageSize(publicFile(src))).toEqual({ width: image.width, height: image.height });
    },
  );

  it("the CV is published", () => {
    expect(existsSync(publicFile(profile.cv.href))).toBe(true);
  });
});

describe("experience and skills", () => {
  it("has unique timeline ids", () => {
    expect(new Set(experience.map((item) => item.id)).size).toBe(experience.length);
  });

  it("rates languages on the CEFR scale", () => {
    for (const language of languages) expect(language.cefr).toBeGreaterThanOrEqual(1);
  });

  it("lists the awards", () => {
    expect(awards.length).toBe(15);
  });
});
