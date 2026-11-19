/**
 * The tests' `page`, which fails the test on any console error or uncaught exception, so a
 * broken script or a hydration mismatch can't slip through.
 */
import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, runTest) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
    await runTest(page);
    expect(problems, "the page logged errors").toEqual([]);
  },
});

export { expect };
