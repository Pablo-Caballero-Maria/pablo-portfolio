"use client";

import { useEffect } from "react";

import { applyTheme, browserStorage, oppositeTheme, resolveTheme, storeTheme } from "@/lib/theme";

import { Moon, Sun } from "lucide-react";

/**
 * Switches between light (the default) and dark and remembers the choice. Which icon shows is pure
 * CSS (the `dark:` variant), so the server-rendered button is already right before any JavaScript
 * runs.
 */
export function ThemeToggle() {
  // The <head> script set data-theme before the first paint; the browser's theme colour follows.
  useEffect(() => applyTheme(resolveTheme(document.documentElement.dataset.theme)), []);

  function toggle() {
    const next = oppositeTheme(resolveTheme(document.documentElement.dataset.theme));
    applyTheme(next);
    storeTheme(browserStorage(), next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-ink hover:border-accent"
      aria-label="Switch colour theme"
    >
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </button>
  );
}
