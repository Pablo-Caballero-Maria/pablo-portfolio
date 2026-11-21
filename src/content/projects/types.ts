/**
 * A project: the card on the home page and its documentation page (/projects/<slug>).
 * Text fields accept the inline markup of src/lib/rich-text.ts.
 */
import type { ImageAsset } from "../types";

/** Each project has its own hue; the colours are CSS tokens in globals.css (--hue-<name>). */
export type ProjectHue = "sinophile" | "piano" | "heart" | "molecula" | "milan";

/** Where a project can be seen: deployed projects link to the live site. */
export type Deployment = { kind: "live"; url: string } | { kind: "local"; note: string };

export interface Figure extends ImageAsset {
  caption: string;
}

export type DocBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "figure"; figure: Figure }
  | { kind: "code"; language: string; code: string; caption?: string }
  | { kind: "table"; caption?: string; head: string[]; rows: string[][] }
  | { kind: "callout"; title: string; text: string };

export interface DocSection {
  /** Anchor on the documentation page; unique within the project. */
  id: string;
  title: string;
  blocks: DocBlock[];
}

export interface Highlight {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  /** E.g. "Web app · personal project". */
  kind: string;
  year: string;
  /** One line under the name. */
  tagline: string;
  /** Two or three sentences for the card and the page's meta description. */
  summary: string;
  hue: ProjectHue;
  deployment: Deployment;
  repository: string;
  cover: ImageAsset;
  highlights: Highlight[];
  stack: string[];
  sections: DocSection[];
}
