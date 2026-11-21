import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Projects } from "@/components/home/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { getProject, projects } from "@/content/projects";

function card(slug: string) {
  render(<ProjectCard project={getProject(slug)!} />);
  return screen.getByRole("article");
}

describe("ProjectCard", () => {
  it("links a deployed project to its live site, in a new tab", () => {
    const article = card("sinophile");
    const visit = within(article).getByRole("link", { name: /visit site/i });
    expect(visit).toHaveAttribute("href", "https://sinophile.vercel.app");
    expect(visit).toHaveAttribute("target", "_blank");
    expect(visit).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(within(article).getByText("Live")).toBeInTheDocument();
    expect(within(article).getByText("sinophile.vercel.app")).toBeInTheDocument();
  });

  it("has no live link for a project that only runs locally, and says so", () => {
    const article = card("milan-cdr");
    expect(within(article).queryByRole("link", { name: /visit site/i })).toBeNull();
    expect(within(article).getByText("Not deployed")).toBeInTheDocument();
    expect(within(article).getByText(/runs locally/i)).toBeInTheDocument();
  });

  it("links to its documentation page and its code", () => {
    const article = card("piano");
    expect(within(article).getByRole("link", { name: "Documentation for ESP32 Piano" })).toHaveAttribute(
      "href",
      "/projects/piano",
    );
    expect(within(article).getByRole("link", { name: /^code/i })).toHaveAttribute(
      "href",
      "https://github.com/Pablo-Caballero-Maria/piano",
    );
  });

  it("is named by its title and shows its key figures", () => {
    card("molecular-activity");
    const article = screen.getByRole("article", { name: "Molecular activity prediction" });
    expect(within(article).getByText("0.669")).toBeInTheDocument();
    expect(within(article).getByText("7,015")).toBeInTheDocument();
  });

  it("takes the project's own hue", () => {
    expect(card("piano").style.getPropertyValue("--project")).toBe("var(--hue-piano)");
  });
});

describe("Projects section", () => {
  it("shows a card per project and counts the live ones", () => {
    render(<Projects />);
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
    expect(screen.getByText("3 live")).toBeInTheDocument();
    expect(screen.getByText("2 run locally")).toBeInTheDocument();
  });
});
