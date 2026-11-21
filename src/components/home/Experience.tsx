import Image from "next/image";

import { experience, experienceFilters, publication } from "@/content/experience";
import type { ExperienceItem } from "@/content/types";
import { countByCategory } from "@/lib/experience";

import { RichText } from "../ui/RichText";
import { SectionHeading } from "../ui/SectionHeading";
import { TagList } from "../ui/TagList";
import { ExperienceFilter } from "./ExperienceFilter";

function TimelineEntry({ item }: { item: ExperienceItem }) {
  const tech = item.category === "tech";
  const marker = [
    "absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 md:left-[calc(11.5rem-7px)]",
    tech ? "border-accent" : "border-warm",
    item.upcoming ? "border-dashed" : "",
    item.highlight ? "bg-accent" : "bg-surface",
  ].join(" ");

  const content = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-bold">
          {item.title}
          {item.upcoming && (
            <span className="ml-2 rounded-full border border-accent px-2 py-0.5 align-middle font-mono text-[10px] tracking-wider text-accent uppercase">
              Upcoming
            </span>
          )}
        </h3>
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] ${tech ? "bg-accentsoft text-accent" : "bg-warmsoft text-warm"}`}
        >
          {item.location}
        </span>
      </div>
      <p className="text-sm font-medium text-muted">{item.organisation}</p>
      {item.body.map((paragraph, index) => (
        <p key={index} className="mt-3 max-w-[65ch]">
          <RichText text={paragraph} />
        </p>
      ))}
      {(item.tags || item.link) && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {item.tags && <TagList tags={item.tags} label="Topics" />}
          {item.link && (
            <a
              className="text-sm font-semibold text-accent hover:underline"
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.link.label}
            </a>
          )}
        </div>
      )}
    </>
  );

  return (
    <li
      data-cat={item.category}
      className="relative grid gap-2 pl-8 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0"
    >
      <div className="font-mono text-xs leading-6 text-muted md:text-right">
        <span className={marker} aria-hidden="true" />
        {item.period}
      </div>
      <article
        className={`overflow-hidden rounded-xl border border-line bg-bg md:ml-2 ${item.upcoming ? "border-dashed" : ""}`}
      >
        {item.image ? (
          <div className="grid sm:grid-cols-[1fr_14rem]">
            <div className="p-5">{content}</div>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              sizes="(min-width: 640px) 14rem, 100vw"
              className="h-48 w-full border-t border-line object-cover sm:h-full sm:border-t-0 sm:border-l"
            />
          </div>
        ) : (
          <div className="p-5">{content}</div>
        )}
      </article>
    </li>
  );
}

function PublicationCard() {
  const [before, after] = publication.authors.split(publication.highlightAuthor);
  return (
    <article className="mt-14 grid gap-6 rounded-xl border border-line bg-bg p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
      <div>
        <p className="eyebrow">{publication.kicker}</p>
        <h3 className="mt-2 max-w-[48ch] font-display text-2xl leading-tight font-bold">
          {publication.title}
        </h3>
        <p className="mt-3 text-sm text-muted">
          {before}
          <strong className="text-ink">{publication.highlightAuthor}</strong>
          {after}
        </p>
        <p className="mt-3 font-mono text-xs text-muted">
          <RichText text={publication.venue} />
        </p>
      </div>
      <div className="flex flex-row gap-3 md:flex-col">
        {publication.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-line bg-surface px-4 py-3 text-center">
            <div className="num font-display text-2xl font-bold">{metric.value}</div>
            <div className="font-mono text-[11px] text-muted">{metric.label}</div>
          </div>
        ))}
        <a
          href={publication.doi}
          target="_blank"
          rel="noopener noreferrer"
          className="grid place-items-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-bg hover:opacity-90"
        >
          Read paper ↗
        </a>
      </div>
    </article>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <ExperienceFilter
          filters={experienceFilters}
          counts={countByCategory(experience)}
          heading={
            <SectionHeading
              id="experience-title"
              eyebrow="Experience"
              title="Labs, networks and classrooms"
            />
          }
        >
          {experience.map((item) => (
            <TimelineEntry key={item.id} item={item} />
          ))}
        </ExperienceFilter>
        <PublicationCard />
      </div>
    </section>
  );
}
