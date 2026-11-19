import { describe, expect, it, vi } from "vitest";

import {
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  isTheme,
  oppositeTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from "@/lib/theme";

describe("resolveTheme", () => {
  it("uses an explicit choice over the system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to the system preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(undefined, false)).toBe("light");
    expect(resolveTheme("sepia", true)).toBe("dark");
  });
});

describe("theme helpers", () => {
  it("recognises only the two themes", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("auto")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("flips between them", () => {
    expect(oppositeTheme("light")).toBe("dark");
    expect(oppositeTheme("dark")).toBe("light");
  });
});

describe("storage", () => {
  it("round-trips a choice", () => {
    storeTheme(localStorage, "dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(readStoredTheme(localStorage)).toBe("dark");
  });

  it("ignores unknown stored values", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "purple");
    expect(readStoredTheme(localStorage)).toBeNull();
  });

  it("survives storage that throws or is missing", () => {
    const broken = {
      getItem: vi.fn(() => {
        throw new Error("SecurityError");
      }),
      setItem: vi.fn(() => {
        throw new Error("QuotaExceeded");
      }),
    };
    expect(readStoredTheme(broken)).toBeNull();
    expect(() => storeTheme(broken, "light")).not.toThrow();
    expect(readStoredTheme(undefined)).toBeNull();
  });
});

describe("THEME_INIT_SCRIPT", () => {
  function run() {
    // The same code the browser runs in <head> before the first paint.
    new Function(THEME_INIT_SCRIPT)();
  }

  it("applies a stored choice to <html>", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    run();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("leaves the system preference alone when nothing valid is stored", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "<script>");
    run();
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
