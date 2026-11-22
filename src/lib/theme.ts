/**
 * Colour theme: light unless the visitor picked dark with the toggle, which is remembered in
 * localStorage and applied as <html data-theme="…">. The CSS tokens for both themes are in
 * src/app/globals.css.
 */

export type Theme = "light" | "dark";

/** Same key as the original static site, so a choice made there is kept. */
export const THEME_STORAGE_KEY = "pcm-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** The theme every visit starts with. */
export const DEFAULT_THEME: Theme = "light";

/** The page background of each theme (globals.css → --bg), for the browser's theme colour. */
export const THEME_COLORS: Record<Theme, string> = { light: "#f3f6f7", dark: "#0a1318" };

/** The theme in effect: the explicit choice if there is one, else light. */
export function resolveTheme(explicit: string | null | undefined): Theme {
  return isTheme(explicit) ? explicit : DEFAULT_THEME;
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

/** `window.localStorage`, or undefined where even reading it throws (blocked site data). */
export function browserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/** Reads the stored choice; storage can be missing or throw (private mode, blocked cookies). */
export function readStoredTheme(storage: Pick<Storage, "getItem"> | undefined): Theme | null {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(storage: Pick<Storage, "setItem"> | undefined, theme: Theme): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Not remembered, but the page still switches.
  }
}

/** Applies a theme to the page: <html data-theme> and the browser's theme colour (phones' address bar). */
export function applyTheme(theme: Theme, doc: Document = document): void {
  doc.documentElement.dataset.theme = theme;
  doc.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

/**
 * Runs in <head> before the first paint, so a stored choice never flashes the other theme.
 * Kept dependency-free and tiny: it's inlined into every page.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
