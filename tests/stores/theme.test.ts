import { beforeEach, describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "@/lib/theme";
import { useThemeStore } from "@/stores/theme";

beforeEach(() => useThemeStore.setState({ theme: "light" }));

describe("useThemeStore", () => {
  it("syncs with the theme the <head> script applied", () => {
    document.documentElement.dataset.theme = "dark";
    useThemeStore.getState().sync();
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("falls back to light when the page has none", () => {
    useThemeStore.getState().sync();
    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("toggles, applies and remembers the choice", () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    useThemeStore.getState().toggle();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});
