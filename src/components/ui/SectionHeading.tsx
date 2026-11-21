import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  /** The heading's id, for aria-labelledby on the section. */
  id?: string;
  level?: 2 | 3;
  className?: string;
}

/** The small mono label above a section title, and the title itself. */
export function SectionHeading({ eyebrow, title, id, level = 2, className = "" }: SectionHeadingProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <Heading
        id={id}
        className={`mt-2 font-display font-bold tracking-tight ${level === 2 ? "text-3xl" : "text-2xl"}`}
      >
        {title}
      </Heading>
    </div>
  );
}
