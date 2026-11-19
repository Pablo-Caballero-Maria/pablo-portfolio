/**
 * Types of the site's content. All copy lives in src/content as typed data, separate from the
 * components that present it; strings may use the inline markup of src/lib/rich-text.ts.
 */

/** An image in public/, with its intrinsic size (needed by next/image to avoid layout shift). */
export interface ImageAsset {
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
}

export interface Link {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: string;
  /** Smaller text after the value, e.g. "/10". */
  unit?: string;
  note: string;
  href?: string;
}

export type ExperienceCategory = "tech" | "vol";

export interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  organisation: string;
  location: string;
  category: ExperienceCategory;
  /** Paragraphs (rich text). */
  body: string[];
  tags?: string[];
  upcoming?: boolean;
  /** A filled timeline marker, for milestones. */
  highlight?: boolean;
  link?: Link;
  image?: ImageAsset;
}

export interface Publication {
  kicker: string;
  title: string;
  authors: string;
  highlightAuthor: string;
  venue: string;
  doi: string;
  metrics: { value: string; label: string }[];
}

export interface EducationItem {
  id: string;
  period: string;
  location: string;
  title: string;
  institution: string;
  description?: string;
  /** A score shown as a bar (value out of max) or as a big number. */
  score?: { value: number; max: number; display: "bar" | "number" };
  badge?: string;
  upcoming?: boolean;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Language {
  name: string;
  /** Rich text: may contain a link to a certificate. */
  level: string;
  /** CEFR level as 1 (A1) to 6 (C2). */
  cefr: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface Award {
  code: string;
  tone: "accent" | "warm";
  text: string;
}

export interface Country {
  /** ISO 3166-1 numeric code (as in world-atlas). */
  id: string;
  name: string;
  kind: "work" | "trip";
  text: string;
}

export interface Photo extends ImageAsset {
  /** Place and context, shown above the caption. */
  tag: string;
  tone: "accent" | "warm";
  objectPosition?: string;
}

export interface AcademicReference {
  quote: string;
  author: string;
  initials: string;
  role: string;
  date: string;
  letter: string[];
}

export interface VolunteerReference {
  place: string;
  date: string;
  quote: string;
  host: string;
}

export interface NavItem {
  id: string;
  label: string;
}
