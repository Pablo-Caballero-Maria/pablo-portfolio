import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";
import { OFFLINE_FALLBACK, offlinePages } from "@/sw/pages";
import { isDocument, isPage, type RequestInfo } from "@/sw/requests";
import { buildRevision } from "@/sw/revision";

const info = (path: string, mode: string, destination: string, sameOrigin = true): RequestInfo => ({
  url: new URL(path, "https://pablo-caballero.vercel.app"),
  request: { mode: mode as RequestMode, destination: destination as RequestDestination },
  sameOrigin,
});

describe("service worker", () => {
  it("downloads the home page and every project page at install", () => {
    const pages = offlinePages(projects.map((project) => project.slug));
    expect(pages[0]).toBe("/");
    expect(pages).toHaveLength(projects.length + 1);
    expect(pages).toContain("/projects/sinophile");
    expect(pages).not.toContain(OFFLINE_FALLBACK);
  });

  it("treats same-origin navigations as pages and falls back only for documents", () => {
    expect(isPage(info("/projects/piano", "navigate", "document"))).toBe(true);
    expect(isPage(info("/", "navigate", "document", false))).toBe(false);
    expect(isPage(info("/_next/static/chunks/a.js", "no-cors", "script"))).toBe(false);
    expect(isDocument(info("/x", "navigate", "document"))).toBe(true);
    expect(isDocument(info("/x.webp", "no-cors", "image"))).toBe(false);
  });

  it("revisions the offline page by commit", () => {
    expect(buildRevision({ VERCEL_GIT_COMMIT_SHA: "abc123" })).toBe("abc123");
    expect(buildRevision({})).toMatch(/^[0-9a-f-]{36,40}$/);
  });
});
