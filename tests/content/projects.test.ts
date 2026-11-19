import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  type DocBlock,
  type Project,
  displayUrl,
  getAdjacentProjects,
  getProject,
  liveUrl,
  projects,
} from "@/content/projects";
import { parseInline } from "@/lib/rich-text";

import { imageSize, publicFile } from "../helpers/image-size";

/** Every rich-text string of a project (tagline, summary, highlights, documentation). */
function textsOf(project: Project): string[] {
  const fromBlock = (block: DocBlock): string[] => {
    switch (block.kind) {
      case "paragraph":
        return [block.text];
      case "list":
      case "steps":
        return block.items;
      case "figure":
        return [block.figure.caption];
      case "callout":
        return [block.title, block.text];
      case "table":
        return [...block.head, ...block.rows.flat()];
      case "code":
        return block.caption ? [block.caption] : [];
    }
  };
  return [
    project.tagline,
    project.summary,
    ...project.highlights.flatMap((highlight) => [highlight.value, highlight.label]),
    ...project.sections.flatMap((section) => [section.title, ...section.blocks.flatMap(fromBlock)]),
  ];
}

function imagesOf(project: Project) {
  return [
    project.cover,
    ...project.sections.flatMap((section) =>
      section.blocks.flatMap((block) => (block.kind === "figure" ? [block.figure] : [])),
    ),
  ];
}

describe("the projects", () => {
  it("are the four in the portfolio, deployed ones first", () => {
    expect(projects.map((project) => project.slug)).toEqual([
      "sinophile",
      "piano",
      "molecular-activity",
      "milan-cdr",
    ]);
  });

  it("link to the live site only when they are deployed", () => {
    expect(liveUrl(getProject("sinophile")!)).toBe("https://sinophile.vercel.app");
    expect(liveUrl(getProject("piano")!)).toBe("https://piano-web-virid.vercel.app");
    expect(liveUrl(getProject("molecular-activity")!)).toBeNull();
    expect(liveUrl(getProject("milan-cdr")!)).toBeNull();
  });

  it("have unique, URL-safe slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
});

describe.each(projects.map((project) => [project.slug, project] as const))("%s", (_slug, project) => {
  it("links to its public GitHub repository", () => {
    expect(project.repository).toMatch(/^https:\/\/github\.com\/Pablo-Caballero-Maria\/[\w.-]+$/);
  });

  it("explains where it runs", () => {
    if (project.deployment.kind === "live") expect(project.deployment.url).toMatch(/^https:\/\//);
    else expect(project.deployment.note).not.toBe("");
  });

  it("has three highlights, a stack and documentation", () => {
    expect(project.highlights).toHaveLength(3);
    expect(project.stack.length).toBeGreaterThan(0);
    expect(project.sections.length).toBeGreaterThanOrEqual(4);
    for (const section of project.sections) expect(section.blocks.length).toBeGreaterThan(0);
  });

  it("gives its documentation sections unique anchor ids", () => {
    const ids = project.sections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("only links to secure external pages", () => {
    const links = textsOf(project)
      .flatMap(parseInline)
      .filter((node) => node.type === "link");
    for (const link of links) expect(link.href).toMatch(/^(https:\/\/|\/|#)/);
  });

  it("has tables with a cell for every column", () => {
    for (const section of project.sections) {
      for (const block of section.blocks) {
        if (block.kind !== "table") continue;
        for (const row of block.rows) expect(row).toHaveLength(block.head.length);
      }
    }
  });

  it("declares the real size of every image, with alt text", () => {
    for (const image of imagesOf(project)) {
      const file = publicFile(image.src);
      expect(existsSync(file), image.src).toBe(true);
      expect(imageSize(file), image.src).toEqual({ width: image.width, height: image.height });
      expect(image.alt.length, image.src).toBeGreaterThan(10);
    }
  });
});

describe("lookups", () => {
  it("finds a project by slug, or nothing", () => {
    expect(getProject("piano")?.name).toBe("ESP32 Piano");
    expect(getProject("nope")).toBeUndefined();
  });

  it("pages through the projects in a loop", () => {
    expect(getAdjacentProjects("sinophile")).toMatchObject({
      previous: { slug: "milan-cdr" },
      next: { slug: "piano" },
    });
    expect(getAdjacentProjects("milan-cdr")?.next.slug).toBe("sinophile");
    expect(getAdjacentProjects("nope")).toBeUndefined();
  });

  it("shows addresses without the protocol", () => {
    expect(displayUrl("https://sinophile.vercel.app")).toBe("sinophile.vercel.app");
    expect(displayUrl("https://example.com/")).toBe("example.com");
  });
});
