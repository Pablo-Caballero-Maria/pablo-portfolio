import { describe, expect, it } from "vitest";

import type { ExperienceItem } from "@/content/types";
import { formatPosition, wrapIndex } from "@/lib/cycle";
import { countByCategory } from "@/lib/experience";
import { siteUrl } from "@/lib/site";

describe("wrapIndex", () => {
  it("loops past either end", () => {
    expect(wrapIndex(-1, 16)).toBe(15);
    expect(wrapIndex(16, 16)).toBe(0);
    expect(wrapIndex(33, 16)).toBe(1);
    expect(wrapIndex(3, 16)).toBe(3);
  });

  it("is safe on an empty list", () => {
    expect(wrapIndex(5, 0)).toBe(0);
  });
});

describe("formatPosition", () => {
  it("is 1-based and zero-padded", () => {
    expect(formatPosition(0, 16)).toBe("01 / 16");
    expect(formatPosition(15, 16)).toBe("16 / 16");
    expect(formatPosition(4, 120)).toBe("005 / 120");
  });
});

describe("countByCategory", () => {
  const item = (id: string, category: ExperienceItem["category"]): ExperienceItem => ({
    id,
    category,
    period: "",
    title: "",
    organisation: "",
    location: "",
    body: [],
  });

  it("counts every filter", () => {
    expect(countByCategory([item("a", "tech"), item("b", "vol"), item("c", "tech")])).toEqual({
      all: 3,
      tech: 2,
      vol: 1,
    });
  });
});

describe("siteUrl", () => {
  it("prefers SITE_URL", () => {
    expect(
      siteUrl({ SITE_URL: "https://pablo.dev", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }).href,
    ).toBe("https://pablo.dev/");
  });

  it("uses Vercel's production domain on Vercel", () => {
    expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app" }).href).toBe(
      "https://portfolio.vercel.app/",
    );
  });

  it("falls back to localhost", () => {
    expect(siteUrl({}).href).toBe("http://localhost:3000/");
    expect(siteUrl({ PORT: "4000" }).href).toBe("http://localhost:4000/");
  });
});
