"use client";

import { browserStorage, oppositeTheme, resolveTheme, storeTheme } from "@/lib/theme";

import { Moon, Sun } from "lucide-react";

/**
 * Switches between light and dark and remembers the choice. Which icon shows is pure CSS (the
 * `dark:` variant), so the server-rendered button is already right before any JavaScript runs.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = oppositeTheme(resolveTheme(root.dataset.theme, systemDark));
    root.dataset.theme = next;
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
