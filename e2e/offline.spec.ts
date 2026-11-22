/**
 * The service worker (src/sw/worker.ts): after the first visit, the site opens without a
 * connection, also pages that weren't visited.
 */
import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

/** Waits until the service worker controls the page and has saved every page. */
async function waitForServiceWorker(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((resolve) => navigator.serviceWorker.addEventListener("controllerchange", resolve));
  });
  await expect
    .poll(() => page.evaluate(async () => (await (await caches.open("pages")).keys()).length))
    .toBe(6); // the home page and the five projects
}

// Offline, the screenshots of a page never opened before (resized by next/image) can't load.
test.use({ allowedErrors: [/Failed to load resource: net::ERR_(FAILED|INTERNET_DISCONNECTED)/] });

test("opens unvisited pages offline", async ({ page, context }) => {
  await page.goto("/");
  await waitForServiceWorker(page);
  await context.setOffline(true);

  await page.goto("/projects/milan-cdr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Milan CDR analytics");
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await context.setOffline(false);
});
