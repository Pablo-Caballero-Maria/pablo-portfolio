import Link from "next/link";

import { navigation, profile } from "@/content/profile";

import { MobileMenu } from "./MobileMenu";
import { PrimaryNav } from "./PrimaryNav";
import { ThemeToggle } from "./ThemeToggle";

/** The sticky header on every page: logo, section links, theme toggle and the CV. */
export function SiteHeader() {
  return (
    <header
      className="sticky z-40 border-b border-line backdrop-blur"
      style={{
        top: "env(safe-area-inset-top, 0px)",
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
      }}
    >
      <nav
        className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-3 sm:px-6"
        aria-label="Main"
      >
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink font-mono text-xs text-bg">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.shortName}</span>
        </Link>
        <PrimaryNav items={navigation} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={profile.cv.href}
            download={profile.cv.downloadName}
            className="hidden rounded-md bg-accent px-3 py-2 text-sm font-semibold text-bg hover:opacity-90 sm:inline-flex"
          >
            Download CV
          </a>
          <MobileMenu items={navigation} />
        </div>
      </nav>
    </header>
  );
}
