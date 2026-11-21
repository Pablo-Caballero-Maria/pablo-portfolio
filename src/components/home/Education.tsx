import { degree, highSchool, otherEducation, upcomingEducation } from "@/content/education";
import type { EducationItem } from "@/content/types";

import { RichText } from "../ui/RichText";
import { SectionHeading } from "../ui/SectionHeading";

function ScoreBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div
      className="h-2 flex-1 overflow-hidden rounded-full bg-raised"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="h-full rounded-full bg-accent" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

function CourseCard({ item }: { item: EducationItem }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-xs text-muted">{item.period}</span>
        <span className="font-mono text-xs text-accent">{item.location}</span>
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{item.title}</h3>
      <p className="text-muted">{item.institution}</p>
      {item.description && <p className="mt-3 text-sm">{item.description}</p>}
      {item.score?.display === "bar" && (
        <div className="mt-4 flex items-center gap-3">
          <ScoreBar value={item.score.value} max={item.score.max} label={`${item.title} grade`} />
          <span className="num font-mono text-sm font-medium">
            {item.score.value}/{item.score.max}
          </span>
        </div>
      )}
    </article>
  );
}

function WideCard({ item }: { item: EducationItem }) {
  return (
    <article
      className={`rounded-xl bg-surface p-6 lg:col-span-2 ${item.upcoming ? "border border-dashed border-accent" : "border border-line"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-muted">{item.period}</div>
          <h3 className="mt-1 font-display text-xl font-bold">{item.title}</h3>
          <p className="text-muted">{item.institution}</p>
        </div>
        {item.badge && (
          <span className="rounded-full bg-accentsoft px-3 py-1 font-mono text-xs text-accent">
            {item.badge}
          </span>
        )}
        {item.score?.display === "number" && (
          <div className="text-right">
            <div className="num font-display text-3xl font-bold">
              {item.score.value}
              <span className="text-base text-muted">/{item.score.max}</span>
            </div>
            <div className="font-mono text-[11px] text-muted">GPA</div>
          </div>
        )}
      </div>
    </article>
  );
}

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24"
    >
      <SectionHeading id="education-title" eyebrow="Education" title="Where I trained" />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <WideCard item={upcomingEducation} />

        <article className="rounded-xl border border-line bg-surface p-6 lg:row-span-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-xs text-muted">{degree.period}</span>
            <span className="font-mono text-xs text-accent">{degree.location}</span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold">{degree.title}</h3>
          <p className="text-muted">{degree.institution}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-warmsoft px-3 py-1 font-mono text-xs text-warm">
            {degree.badge}
          </p>
          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Grade point average</span>
              <span className="num font-display text-2xl font-bold">
                {degree.gpa.value}
                <span className="text-sm text-muted"> / {degree.gpa.max}</span>
              </span>
            </div>
            <div className="mt-2 flex">
              <ScoreBar value={degree.gpa.value} max={degree.gpa.max} label="Degree grade point average" />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {degree.highlights.map((highlight) => (
                <li key={highlight.code} className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] text-accent">{highlight.code}</span>
                  <span>
                    <RichText text={highlight.text} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium">
              Subjects with honor degree (<em>Matrícula de Honor</em>)
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {degree.honours.map((subject, index) => (
                <li
                  key={subject}
                  className={`flex items-center gap-2 rounded-md bg-raised px-3 py-2 text-sm ${index === degree.honours.length - 1 && degree.honours.length % 2 === 1 ? "sm:col-span-2" : ""}`}
                >
                  <span className="font-mono text-[11px] text-accent">MH</span>
                  {subject}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {otherEducation.map((item) => (
          <CourseCard key={item.id} item={item} />
        ))}

        <WideCard item={highSchool} />
      </div>
    </section>
  );
}
