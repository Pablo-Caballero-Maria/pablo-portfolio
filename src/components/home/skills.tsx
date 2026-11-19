import { awards, languages, skillGroups, workStyle } from "@/content/education";
import type { Language } from "@/content/types";

import { ChevronDownIcon } from "../ui/icons";
import { RichText } from "../ui/rich-text";
import { SectionHeading } from "../ui/section-heading";

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

function LanguageLevel({ language }: { language: Language }) {
  return (
    <li>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{language.name}</span>
        <span className="font-mono text-xs text-muted">
          <RichText text={language.level} linkClassName="text-accent hover:underline" />
        </span>
      </div>
      <div
        className="mt-1.5 grid grid-cols-6 gap-1"
        role="img"
        aria-label={`${language.name}: ${CEFR[language.cefr - 1]} on the CEFR scale`}
      >
        {CEFR.map((level, index) => (
          <span
            key={level}
            className={`h-2 rounded-sm ${index < language.cefr ? "bg-accent" : "bg-raised"}`}
          />
        ))}
      </div>
    </li>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading id="skills-title" eyebrow="Skills" title="What I bring to a team" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.title} className="rounded-xl border border-line bg-bg p-6">
              <h3 className="font-display text-lg font-bold">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                {group.items.map((item) => (
                  <li key={item} className="rounded-md bg-accentsoft px-2.5 py-1 text-accent">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-xl border border-line bg-bg p-6 md:col-span-2">
            <h3 className="font-display text-lg font-bold">Languages</h3>
            <ul className="mt-5 space-y-4">
              {languages.map((language) => (
                <LanguageLevel key={language.name} language={language} />
              ))}
            </ul>
            <p className="mt-4 font-mono text-[11px] text-muted">Scale: {CEFR.join(" · ")}</p>
          </div>
          <div className="rounded-xl border border-line bg-bg p-6">
            <h3 className="font-display text-lg font-bold">How I work</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {workStyle.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-warm" aria-hidden="true">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <details className="group mt-8 rounded-xl border border-line bg-bg">
          <summary className="flex items-center justify-between gap-4 p-6">
            <span>
              <span className="eyebrow block">Recognition</span>
              <span className="mt-1 block font-display text-xl font-bold">
                Scholarships, awards &amp; certificates{" "}
                <span className="num text-muted">({awards.length})</span>
              </span>
            </span>
            <ChevronDownIcon className="chev h-5 w-5 shrink-0 text-muted transition-transform" />
          </summary>
          <ul className="grid gap-x-8 gap-y-3 border-t border-line p-6 text-sm md:grid-cols-2">
            {awards.map((award) => (
              <li key={award.text} className="flex gap-3">
                <span
                  className={`mt-0.5 font-mono text-[11px] ${award.tone === "warm" ? "text-warm" : "text-accent"}`}
                >
                  {award.code}
                </span>
                <span>
                  <RichText text={award.text} linkClassName="text-accent hover:underline" />
                </span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
