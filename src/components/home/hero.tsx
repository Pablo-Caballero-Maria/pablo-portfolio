import Image from "next/image";

import { profile, stats } from "@/content/profile";

import { ArrowRightIcon, DownloadIcon, GitHubIcon } from "../ui/icons";

const secondaryButton =
  "inline-flex items-center gap-2 rounded-md border border-line bg-surface px-5 py-3 font-semibold hover:border-accent";

/** Name, pitch and calls to action, the graduation photo, and the band of headline figures. */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="hero-grid border-b border-line">
      <div className="mx-auto grid max-w-page items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div className="reveal">
          <p className="eyebrow mb-4">{profile.role}</p>
          <h1
            id="hero-title"
            className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Pablo
            <br />
            Caballero María
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg text-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 font-semibold text-bg hover:opacity-90"
            >
              Get in touch
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#projects" className={secondaryButton}>
              See my projects
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
            <a href={profile.cv.href} download={profile.cv.downloadName} className={secondaryButton}>
              <DownloadIcon className="h-4 w-4" />
              CV (PDF)
            </a>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
            <span>{profile.location}</span>
            <span aria-hidden="true">/</span>
            <span>{profile.languagesLine}</span>
            <span aria-hidden="true">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {profile.availability}
            </span>
          </p>
        </div>
        <figure className="reveal reveal-2 relative">
          <div className="relative overflow-hidden rounded-xl border border-line bg-raised">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={profile.portrait.width}
              height={profile.portrait.height}
              preload
              sizes="(min-width: 768px) 30rem, 100vw"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="scan" aria-hidden="true" />
          </div>
          <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-xs text-muted">
            <span>{profile.portraitCaption}</span>
            <span className="shrink-0 text-accent">{profile.portraitTag}</span>
          </figcaption>
        </figure>
      </div>

      <div className="border-t border-line bg-surface">
        <dl className="mx-auto grid max-w-page grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-surface px-4 py-5 sm:px-6 ${index === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <dt className="font-mono text-[11px] tracking-wider text-muted uppercase">{stat.label}</dt>
              <dd className="num mt-1 font-display text-3xl font-bold">
                {stat.value}
                {stat.unit && <span className="text-base text-muted">{stat.unit}</span>}
              </dd>
              <dd className="text-xs text-muted">
                {stat.href ? (
                  <a href={stat.href} className="hover:text-accent">
                    {stat.note}
                  </a>
                ) : (
                  stat.note
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
