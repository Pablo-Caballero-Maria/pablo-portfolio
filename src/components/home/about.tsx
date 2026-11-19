import { about } from "@/content/profile";

import { SectionHeading } from "../ui/section-heading";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="grid gap-10 md:grid-cols-[14rem_1fr]">
        <SectionHeading id="about-title" eyebrow="About" title={about.title} />
        <div className="max-w-[65ch] space-y-4 text-[17px]">
          {about.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
