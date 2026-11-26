import { expect, test } from "./fixtures";

// The fixtures fail a test on any console error, so a script, style or request the Content
// Security Policy blocks anywhere in the other tests fails them too.
test.describe("security headers", () => {
  for (const path of ["/", "/projects/piano", "/countries-110m.json"]) {
    test(`are sent with ${path}`, async ({ request }) => {
      const headers = (await request.get(path)).headers();
      expect(headers["content-security-policy"]).toContain("default-src 'self'");
      expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
      expect(headers["strict-transport-security"]).toBe("max-age=63072000; includeSubDomains");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["x-powered-by"]).toBeUndefined();
    });
  }
});

test.describe("the Content Security Policy", () => {
  // The browser reports the blocked script in the console, as it should.
  // One pattern: Playwright reads a two-item array as [value, options].
  test.use({
    allowedErrors: [
      /violates the following Content Security Policy|CSP violation: script-src-elem blocked https:\/\/example\.org\//,
    ],
  });

  test("blocks scripts from other sites", async ({ page }) => {
    await page.goto("/");
    const violations = await page.evaluate(
      () =>
        new Promise<{ directive: string; blocked: string }[]>((resolve) => {
          const seen: { directive: string; blocked: string }[] = [];
          document.addEventListener("securitypolicyviolation", (event) =>
            seen.push({ directive: event.violatedDirective, blocked: event.blockedURI }),
          );
          const script = document.createElement("script");
          script.src = "https://example.org/evil.js";
          script.onerror = () => setTimeout(() => resolve(seen), 200);
          document.head.append(script);
        }),
    );
    expect(violations).toEqual([{ directive: "script-src-elem", blocked: "https://example.org/evil.js" }]);
  });
});
