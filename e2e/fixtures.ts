/**
 * The tests' `page`, which fails the test on any console error or uncaught exception, so a
 * broken script or a hydration mismatch can't slip through. A test that expects some errors on
 * purpose (offline, images that were never downloaded fail to load) declares them with
 * `test.use({ allowedErrors: [/ERR_FAILED/] })`.
 */
import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ allowedErrors: RegExp[] }>({
  allowedErrors: [[], { option: true }],
  page: async ({ page, allowedErrors }, runTest) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      if (allowedErrors.some((pattern) => pattern.test(message.text()))) return;
      problems.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
    await runTest(page);
    expect(problems, "the page logged errors").toEqual([]);
  },
});

export { expect };
