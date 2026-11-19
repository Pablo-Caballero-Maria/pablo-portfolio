import { profile } from "@/content/profile";

import { DownloadIcon } from "../ui/icons";
import { CopyButton } from "./copy-button";

const row = { background: "color-mix(in srgb, var(--bg) 8%, var(--ink))" };
const soft = { color: "color-mix(in srgb, var(--bg) 75%, var(--ink))" };

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line bg-ink text-bg">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p
            className="font-mono text-xs tracking-[.12em] uppercase"
            style={{ color: "color-mix(in srgb, var(--bg) 65%, var(--accent))" }}
          >
            Contact
          </p>
          <h2 id="contact-title" className="mt-2 font-display text-4xl font-bold tracking-tight">
            Let&apos;s work on something that matters.
          </h2>
          <p className="mt-4 max-w-[45ch]" style={soft}>
            Open to master&apos;s programs, research positions and data-science roles in health and
            biomedicine.
          </p>
          <a
            href={profile.cv.href}
            download={profile.cv.downloadName}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-bg px-5 py-3 font-semibold text-ink hover:opacity-90"
          >
            <DownloadIcon className="h-4 w-4" />
            Download CV (PDF)
          </a>
        </div>
        <ul className="grid gap-3 self-center">
          <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3" style={row}>
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-wider uppercase opacity-70">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="font-medium break-all select-all hover:underline"
              >
                {profile.email}
              </a>
            </div>
            <CopyButton
              text={profile.email}
              what="email address"
              className="rounded-md border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: "color-mix(in srgb, var(--bg) 30%, var(--ink))" }}
            />
          </li>
          <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3" style={row}>
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-wider uppercase opacity-70">Location</p>
              <p className="font-medium">{profile.location}</p>
            </div>
          </li>
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-4 py-3 font-semibold hover:opacity-90"
              style={row}
            >
              <span>{profile.github.replace("https://", "")}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
