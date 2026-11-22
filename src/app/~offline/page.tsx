import type { Metadata } from "next";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Offline", robots: { index: false } };

/** What the service worker shows for a page it hasn't saved while there is no connection. */
export default function Offline() {
  return (
    <section className="hero-grid border-b border-line">
      <div className="mx-auto max-w-page px-4 py-28 sm:px-6">
        <p className="eyebrow">Offline</p>
        <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">No connection</h1>
        <p className="mt-4 max-w-[48ch] text-lg text-muted">
          This page isn&apos;t saved on this device yet. Once the site has been opened, the home page and
          every project page work without a connection.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 font-semibold text-bg hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
