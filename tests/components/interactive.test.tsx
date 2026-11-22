import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CopyButton } from "@/components/home/CopyButton";
import { ExperienceFilter } from "@/components/home/ExperienceFilter";
import { PhotoReel } from "@/components/home/PhotoReel";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Tabs } from "@/components/ui/Tabs";
import { navigation } from "@/content/profile";
import { photos } from "@/content/world";
import { THEME_STORAGE_KEY } from "@/lib/theme";

import { mockMatchMedia } from "../setup";

describe("ThemeToggle", () => {
  it("starts light and switches to dark, remembering it", async () => {
    render(<ThemeToggle />);
    expect(document.documentElement.dataset.theme).toBe("light");
    await userEvent.click(screen.getByRole("button", { name: "Switch colour theme" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("starts light even when the system prefers dark", async () => {
    delete document.documentElement.dataset.theme;
    mockMatchMedia(true);
    render(<ThemeToggle />);
    expect(document.documentElement.dataset.theme).toBe("light");
    await userEvent.click(screen.getByRole("button"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    mockMatchMedia(false);
  });

  it("toggles back from an explicit choice", async () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe("ExperienceFilter", () => {
  function setup() {
    render(
      <ExperienceFilter
        filters={[
          { id: "all", label: "All" },
          { id: "vol", label: "Volunteering" },
        ]}
        counts={{ all: 2, vol: 1 }}
        heading={<h2>Experience</h2>}
      >
        <li data-cat="tech">Lab</li>
        <li data-cat="vol">Camp</li>
      </ExperienceFilter>,
    );
  }

  it("starts on the first filter, with its count", () => {
    setup();
    expect(screen.getByRole("button", { name: "All 2" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("list")).toHaveAttribute("data-filter", "all");
  });

  it("marks the chosen filter and sets it on the list for the CSS to dim the rest", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: /volunteering/i }));
    expect(screen.getByRole("button", { name: /volunteering/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /all/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("list")).toHaveAttribute("data-filter", "vol");
  });
});

describe("Tabs", () => {
  function setup() {
    render(
      <Tabs
        label="Reference type"
        tabs={[
          { id: "a", label: "Academic", panel: <p>Letters</p> },
          { id: "b", label: "Hosts", panel: <p>Reviews</p> },
        ]}
      />,
    );
  }

  it("shows the first panel and hides the others", () => {
    setup();
    expect(screen.getByRole("tab", { name: "Academic" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Letters")).toBeVisible();
    expect(screen.getByText("Reviews")).not.toBeVisible();
  });

  it("switches on click", async () => {
    setup();
    await userEvent.click(screen.getByRole("tab", { name: "Hosts" }));
    expect(screen.getByRole("tab", { name: "Hosts" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Hosts" })).toBeVisible();
    expect(screen.getByText("Letters")).not.toBeVisible();
  });

  it("moves with the arrow keys and keeps only the selected tab focusable", async () => {
    setup();
    const academic = screen.getByRole("tab", { name: "Academic" });
    const hosts = screen.getByRole("tab", { name: "Hosts" });
    academic.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(hosts).toHaveFocus();
    expect(hosts).toHaveAttribute("tabindex", "0");
    expect(academic).toHaveAttribute("tabindex", "-1");
    await userEvent.keyboard("{ArrowRight}");
    expect(academic).toHaveFocus();
  });
});

describe("CopyButton", () => {
  it("copies the text and confirms it", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="pablo@example.org" what="email address" />);
    await user.click(screen.getByRole("button", { name: "Copy email address" }));
    expect(await navigator.clipboard.readText()).toBe("pablo@example.org");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("email address copied to the clipboard");
  });

  it("says so when the clipboard refuses", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    render(<CopyButton text="x" what="email address" />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: "Couldn't copy" })).toBeInTheDocument();
  });

  it("goes back to its label after a moment", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<CopyButton text="x" what="email address" />);
    await user.click(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Copy email address" })).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe("MobileMenu", () => {
  it("opens the section links and closes on Escape or when one is chosen", async () => {
    render(<MobileMenu items={navigation} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/#projects");

    await userEvent.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);
    await userEvent.click(screen.getByRole("link", { name: "Projects" }));
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

describe("PhotoReel", () => {
  const viewer = () => document.querySelector("dialog")!;

  it("opens a photo in the viewer, with its position and caption", async () => {
    render(<PhotoReel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: `Open photo: ${photos[2]!.alt}` }));
    expect(viewer().open).toBe(true);
    expect(viewer()).toHaveTextContent(`03 / ${photos.length} · ${photos[2]!.tag}`);
  });

  it("steps through the photos in a loop, with buttons and arrow keys", async () => {
    render(<PhotoReel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: `Open photo: ${photos[0]!.alt}` }));
    await userEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(viewer()).toHaveTextContent(`${photos.length} / ${photos.length}`);
    fireEvent.keyDown(viewer(), { key: "ArrowRight" });
    expect(viewer()).toHaveTextContent(`01 / ${photos.length}`);
  });

  it("closes with its button", async () => {
    render(<PhotoReel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: `Open photo: ${photos[0]!.alt}` }));
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(viewer().open).toBe(false);
  });
});
