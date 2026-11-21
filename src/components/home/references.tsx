import { academicReferences, volunteerReferences, workaway } from "@/content/references";
import type { AcademicReference, VolunteerReference } from "@/content/types";

import { ChevronDown, Quote } from "lucide-react";
import { RichText } from "../ui/rich-text";
import { SectionHeading } from "../ui/section-heading";
import { Tabs } from "../ui/tabs";

function LetterCard({ reference }: { reference: AcademicReference }) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-6">
      <Quote className="h-7 w-7 text-accent" fill="currentColor" />
      <blockquote className="mt-4 font-display text-xl leading-snug font-medium">
        &ldquo;{reference.quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-full bg-accentsoft font-mono text-xs font-medium text-accent"
          aria-hidden="true"
        >
          {reference.initials}
        </span>
        <div>
          <p className="font-semibold">{reference.author}</p>
          <p className="text-sm text-muted">{reference.role}</p>
        </div>
      </div>
      <details className="mt-5 border-t border-line pt-4">
        <summary className="flex items-center gap-2 text-sm font-semibold text-accent">
          Read full letter · {reference.date}
          <ChevronDown className="chev h-4 w-4 transition-transform" />
        </summary>
        <div className="letter mt-4 max-w-[65ch] text-sm text-muted">
          {reference.letter.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </details>
    </article>
  );
}

function HostCard({ reference }: { reference: VolunteerReference }) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-warm">{reference.place}</span>
        <span className="font-mono text-[11px] text-muted">{reference.date}</span>
      </div>
      <blockquote className="mt-4 text-[15px]">&ldquo;{reference.quote}&rdquo;</blockquote>
      <p className="mt-auto pt-5 text-sm font-semibold">{reference.host}</p>
    </article>
  );
}

export function References() {
  return (
    <section
      id="references"
      aria-labelledby="references-title"
      className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24"
    >
      <Tabs
        label="Reference type"
        heading={<SectionHeading id="references-title" eyebrow="References" title="What others say" />}
        tabs={[
          {
            id: "academic",
            label: "Academic",
            panel: (
              <div className="grid gap-5 lg:grid-cols-2">
                {academicReferences.map((reference) => (
                  <LetterCard key={reference.author} reference={reference} />
                ))}
              </div>
            ),
          },
          {
            id: "volunteer",
            label: "Volunteer hosts",
            panel: (
              <>
                <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4 text-sm">
                  <span className="rounded-full bg-warmsoft px-3 py-1 font-mono text-xs text-warm">
                    {workaway.badge}
                  </span>
                  <span className="text-muted">
                    <RichText text={workaway.summary} />
                  </span>
                  <a
                    href={workaway.profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto font-semibold text-accent hover:underline"
                  >
                    See profile ↗
                  </a>
                </div>
                <div className="grid gap-5 lg:grid-cols-3">
                  {volunteerReferences.map((reference) => (
                    <HostCard key={reference.place} reference={reference} />
                  ))}
                </div>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
