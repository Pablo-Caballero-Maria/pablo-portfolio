import Link from "next/link";

import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="hero-grid border-b border-line">
      <div className="mx-auto max-w-page px-4 py-28 sm:px-6">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-4 max-w-[48ch] text-lg text-muted">
          The link may be old or mistyped. Everything on the site is one click away from the home page.
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
