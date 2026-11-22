import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { ServiceWorker } from "@/components/layout/ServiceWorker";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { VercelTelemetry } from "@/components/layout/VercelTelemetry";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/lib/theme";

// Self-hosted by next/font at build time: no request to Google from the visitor's browser.
// Bricolage Grotesque is variable in weight and optical size (opsz), so one file covers all.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage" });
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: profile.description,
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: profile.name,
    description: profile.description,
    images: [{ url: profile.portrait.src, width: profile.portrait.width, height: profile.portrait.height }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The light theme's; the theme toggle switches it with the theme (src/lib/theme.ts).
  themeColor: THEME_COLORS.light,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The theme script sets data-theme before React hydrates, hence suppressHydrationWarning.
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* A plain inline script, not next/script: it must run before the first paint, and
            next/script's beforeInteractive queues inline code for Next's runtime to run later. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <ServiceWorker>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </ServiceWorker>
        <VercelTelemetry />
      </body>
    </html>
  );
}
