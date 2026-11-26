/**
 * The colour theme as shared state (zustand): what is shown and the actions that change it.
 *
 * The <head> script (THEME_INIT_SCRIPT) already put the stored choice on <html data-theme> before
 * the first paint; `sync` reads it from there once React runs. Changing the theme applies it to the
 * page and remembers it in localStorage (src/lib/theme.ts).
 */
import { create } from "zustand";

import {
  DEFAULT_THEME,
  type Theme,
  applyTheme,
  browserStorage,
  oppositeTheme,
  resolveTheme,
  storeTheme,
} from "@/lib/theme";

interface ThemeState {
  theme: Theme;
  /** Takes the theme the page is showing (set by the <head> script) and applies it fully. */
  sync: () => void;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: DEFAULT_THEME,
  sync: () => {
    const theme = resolveTheme(document.documentElement.dataset.theme);
    applyTheme(theme);
    set({ theme });
  },
  setTheme: (theme) => {
    applyTheme(theme);
    storeTheme(browserStorage(), theme);
    set({ theme });
  },
  toggle: () => get().setTheme(oppositeTheme(get().theme)),
}));
