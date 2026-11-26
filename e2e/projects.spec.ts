import { expect, test } from "./fixtures";

const pages = [
  { slug: "sinophile", name: "sinophile", live: "https://sinophile.vercel.app" },
  { slug: "piano", name: "ESP32 Piano", live: "https://esp32-piano.vercel.app" },
  {
    slug: "heart-failure-ai",
    name: "Edge AI for heart failure",
    live: "https://simulador-iot-icc.vercel.app",
  },
  { slug: "molecular-activity", name: "Molecular activity prediction", live: null },
  { slug: "milan-cdr", name: "Milan CDR analytics", live: null },
];

for (const project of pages) {
  test(`${project.slug}: documentation page`, async ({ page }) => {
    await page.goto(`/projects/${project.slug}`);
    await expect(page).toHaveTitle(`${project.name} · Pablo Caballero María`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.name);

    const visit = page.getByRole("link", { name: /visit site/i });
    if (project.live) await expect(visit).toHaveAttribute("href", project.live);
    else await expect(visit).toHaveCount(0);

    // Every image on the page loads.
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    }

    // The table of contents jumps to its sections.
    const toc = page.getByRole("navigation", { name: "On this page" });
    const last = toc.getByRole("link").last();
    const target = (await last.getAttribute("href"))!;
    await last.click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(page.locator(target)).toBeInViewport();
  });
}

test("the pager moves to the next project", async ({ page }) => {
  await page.goto("/projects/sinophile");
  await page
    .getByRole("navigation", { name: "More projects" })
    .getByRole("link", { name: /next project/i })
    .click();
  await expect(page).toHaveURL(/\/projects\/piano$/);
});

test("the header marks Projects on a documentation page", async ({ page }) => {
  await page.goto("/projects/piano");
  await expect(
    page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects", exact: true }),
  ).toHaveAttribute("aria-current", "true");
});

test("an unknown project is a 404", async ({ page }) => {
  // The 404 response itself logs a console error, so this test uses a bare request.
  const response = await page.request.get("/projects/does-not-exist");
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain("This page doesn");
});

test("the sitemap lists every page", async ({ page }) => {
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  for (const project of pages) expect(sitemap).toContain(`/projects/${project.slug}</loc>`);
});
