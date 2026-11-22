import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_THEME,
  THEME_COLORS,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  applyTheme,
  isTheme,
  oppositeTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from "@/lib/theme";

describe("resolveTheme", () => {
  it("uses an explicit choice", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("is light without one, whatever the system prefers", () => {
    expect(DEFAULT_THEME).toBe("light");
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    expect(resolveTheme(null)).toBe("light");
    expect(resolveTheme(undefined)).toBe("light");
    expect(resolveTheme("sepia")).toBe("light");
  });
});

describe("applyTheme", () => {
  it("sets data-theme and the browser's theme colour", () => {
    document.head.innerHTML = `<meta name="theme-color" content="${THEME_COLORS.light}">`;
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(
      THEME_COLORS.dark,
    );
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    document.head.innerHTML = "";
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

  it("leaves the default (light) alone when nothing valid is stored", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "<script>");
    run();
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
