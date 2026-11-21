import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProjectPage, { generateMetadata, generateStaticParams } from "@/app/projects/[slug]/page";
import HomePage from "@/app/page";
import { DocSectionView } from "@/components/projects/DocBlocks";
import { RichText } from "@/components/ui/RichText";
import { navigation } from "@/content/profile";
import { projects } from "@/content/projects";

// The globe downloads d3 and the world map; the home page test only needs the rest.
vi.mock("@/components/home/Globe", () => ({ Globe: () => null }));

function pageProps(slug: string) {
  return { params: Promise.resolve({ slug }), searchParams: Promise.resolve({}) };
}

describe("home page", () => {
  it("has a section for every navigation link", () => {
    const { container } = render(<HomePage />);
    for (const item of navigation) {
      expect(container.querySelector(`section#${item.id}`), item.id).not.toBeNull();
    }
  });

  it("has a single h1 and one card per project", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const section = screen.getByRole("region", { name: "Things I've built" });
    expect(within(section).getAllByRole("article")).toHaveLength(projects.length);
  });
});

describe("project documentation pages", () => {
  it("are prerendered for every project", () => {
    expect(generateStaticParams()).toEqual(projects.map((project) => ({ slug: project.slug })));
  });

  it("render the project with a table of contents and links to its neighbours", async () => {
    render(await ProjectPage(pageProps("piano")));
    expect(screen.getByRole("heading", { level: 1, name: "ESP32 Piano" })).toBeInTheDocument();
    const toc = screen.getByRole("navigation", { name: "On this page" });
    expect(within(toc).getAllByRole("link")).toHaveLength(projects[1]!.sections.length);
    expect(within(toc).getByRole("link", { name: "The journey of one note" })).toHaveAttribute(
      "href",
      "#a-note",
    );
    const pager = screen.getByRole("navigation", { name: "More projects" });
    expect(within(pager).getByRole("link", { name: /sinophile/ })).toHaveAttribute(
      "href",
      "/projects/sinophile",
    );
    expect(screen.getByRole("link", { name: /visit site/i })).toHaveAttribute(
      "href",
      "https://piano-web-virid.vercel.app",
    );
  });

  it("don't offer a live link for local projects", async () => {
    render(await ProjectPage(pageProps("molecular-activity")));
    expect(screen.queryByRole("link", { name: /visit site/i })).toBeNull();
    expect(screen.getByText(/runs locally/i)).toBeInTheDocument();
  });

  it("404 on an unknown slug", async () => {
    await expect(ProjectPage(pageProps("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("describe themselves in the metadata", async () => {
    const metadata = await generateMetadata(pageProps("sinophile"));
    expect(metadata.title).toBe("sinophile");
    expect(metadata.description).toBe(projects[0]!.summary);
    expect(await generateMetadata(pageProps("nope"))).toEqual({});
  });
});

describe("DocSectionView", () => {
  it("renders every kind of block", () => {
    render(
      <DocSectionView
        section={{
          id: "demo",
          title: "Demo",
          blocks: [
            { kind: "paragraph", text: "Some **bold** text." },
            { kind: "steps", items: ["First", "Second"] },
            { kind: "list", items: ["A point"] },
            { kind: "code", language: "js", code: "db.c.find()", caption: "A query." },
            { kind: "table", caption: "Numbers.", head: ["Name", "Value"], rows: [["x", "1"]] },
            { kind: "callout", title: "Note", text: "Mind this." },
          ],
        }}
      />,
    );
    expect(screen.getByRole("region", { name: "Demo" })).toHaveAttribute("id", "demo");
    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("db.c.find()").tagName).toBe("CODE");
    expect(screen.getByRole("rowheader", { name: "x" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Value" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent("NoteMind this.");
  });
});

describe("RichText", () => {
  it("opens external links in a new tab and keeps internal ones in place", () => {
    render(
      <p>
        <RichText text="[Out](https://example.com) and [in](/projects/piano)" />
      </p>,
    );
    expect(screen.getByRole("link", { name: "Out" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "in" })).not.toHaveAttribute("target");
  });
});
