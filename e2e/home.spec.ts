import { expect, test } from "./fixtures";

test.describe("home page", () => {
  test("introduces Pablo and links every section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Pablo Caballero María");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Pablo\s*Caballero María/);

    const nav = page.getByRole("navigation", { name: "Main" });
    for (const label of ["About", "Experience", "Projects", "Education", "Skills", "World", "References"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("shows the four projects, with live links only for the deployed ones", async ({ page }) => {
    await page.goto("/#projects");
    const section = page.getByRole("region", { name: "Things I've built" });
    await expect(section.getByRole("article")).toHaveCount(4);

    const sinophile = section.getByRole("article", { name: "sinophile" });
    await expect(sinophile.getByRole("link", { name: /visit site/i })).toHaveAttribute(
      "href",
      "https://sinophile.vercel.app",
    );
    const piano = section.getByRole("article", { name: "ESP32 Piano" });
    await expect(piano.getByRole("link", { name: /visit site/i })).toHaveAttribute(
      "href",
      "https://piano-web-virid.vercel.app",
    );
    for (const name of ["Molecular activity prediction", "Milan CDR analytics"]) {
      const card = section.getByRole("article", { name });
      await expect(card.getByRole("link", { name: /visit site/i })).toHaveCount(0);
      await expect(card.getByText("Not deployed")).toBeVisible();
    }
  });

  test("opens a project's documentation from its card", async ({ page }) => {
    await page.goto("/#projects");
    await page.getByRole("link", { name: "Documentation for Milan CDR analytics" }).click();
    await expect(page).toHaveURL(/\/projects\/milan-cdr$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Milan CDR analytics");
  });

  test("filters the experience timeline", async ({ page }) => {
    await page.goto("/#experience");
    await page.getByRole("button", { name: /volunteering/i }).click();
    const timeline = page.locator("ol.timeline");
    await expect(timeline).toHaveAttribute("data-filter", "vol");
    await expect(timeline.locator('li[data-cat="tech"]').first()).toHaveCSS("opacity", "0.28");
    await expect(timeline.locator('li[data-cat="vol"]').first()).toHaveCSS("opacity", "1");
  });

  test("draws the globe and turns it to a chosen country", async ({ page }) => {
    await page.goto("/#world");
    const globe = page.locator("svg.globe[data-ready]");
    await expect(globe).toBeVisible();
    await expect(globe.locator("path.visited")).toHaveCount(11);

    await page.getByRole("button", { name: "Thailand", exact: true }).click();
    await expect(page.getByRole("button", { name: "Thailand", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("#world [aria-live=polite]")).toContainText("Sakon Nakhon");
    await expect(globe.locator("path.visited.on")).toHaveCount(1);
  });

  test("browses the photos in the viewer", async ({ page }) => {
    await page.goto("/#world");
    await page.getByRole("button", { name: /^Open photo: First day of preschool/ }).click();
    const viewer = page.getByRole("dialog", { name: "Photo viewer" });
    await expect(viewer).toBeVisible();
    await expect(viewer).toContainText("02 / 16");
    await page.keyboard.press("ArrowRight");
    await expect(viewer).toContainText("03 / 16");
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
  });

  test("switches the reference tabs", async ({ page }) => {
    await page.goto("/#references");
    await page.getByRole("tab", { name: "Volunteer hosts" }).click();
    await expect(page.getByRole("tabpanel", { name: "Volunteer hosts" })).toContainText("Super Workawayer");
    await expect(page.getByRole("tabpanel", { name: "Academic" })).toBeHidden();
  });

  test("offers the CV as a download", async ({ page }) => {
    await page.goto("/");
    const cv = page.getByRole("link", { name: "Download CV", exact: true });
    await expect(cv).toHaveAttribute("download", "Pablo_Caballero_Maria_CV.pdf");
    const response = await page.request.get((await cv.getAttribute("href"))!);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });
});

test.describe("theme", () => {
  test("follows the system, and a choice survives a reload without flashing", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const body = page.locator("body");
    await expect(body).toHaveCSS("background-color", "rgb(243, 246, 247)");

    await page.getByRole("button", { name: "Switch colour theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    // The colours fade over 0.3 s; toHaveCSS waits for the end.
    await expect(body).toHaveCSS("background-color", "rgb(10, 19, 24)");

    // The stored theme must be on <html> before any app script runs.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        (window as unknown as { themeAtLoad: string | null }).themeAtLoad =
          document.documentElement.getAttribute("data-theme");
      });
    });
    await page.reload();
    expect(await page.evaluate(() => (window as unknown as { themeAtLoad: string }).themeAtLoad)).toBe(
      "dark",
    );
  });
});

test.describe("small screens", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("fit the width and use the menu button", async ({ page }) => {
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
