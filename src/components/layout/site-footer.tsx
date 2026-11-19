import { profile } from "@/content/profile";

/** The copyright line at the bottom of every page (the year is the build's). */
export function SiteFooter() {
  return (
    <footer
      className="border-t bg-ink px-4 py-6 text-center font-mono text-xs text-bg sm:px-6"
      style={{ borderColor: "color-mix(in srgb, var(--bg) 15%, var(--ink))" }}
    >
      <span className="opacity-70">
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </span>
    </footer>
  );
}
