/**
 * A tiny inline markup for the site's copy, so content files stay plain strings:
 *
 *   **bold**   *emphasis*   `code`   [label](https://example.com)
 *
 * Markers don't nest; anything that isn't a complete marker is kept as text. Rendered by
 * src/components/ui/rich-text.tsx.
 */

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; value: string; href: string };

// Order matters: `**` must be tried before `*`.
const TOKEN = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\s][^*]*?)\*/g;

/** Splits `source` into text and formatted runs, in order. */
export function parseInline(source: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let last = 0;

  for (const match of source.matchAll(TOKEN)) {
    const index = match.index;
    if (index > last) nodes.push({ type: "text", value: source.slice(last, index) });

    const [, strong, code, label, href, em] = match;
    if (strong !== undefined) nodes.push({ type: "strong", value: strong });
    else if (code !== undefined) nodes.push({ type: "code", value: code });
    else if (label !== undefined && href !== undefined) nodes.push({ type: "link", value: label, href });
    else if (em !== undefined) nodes.push({ type: "em", value: em });

    last = index + match[0].length;
  }

  if (last < source.length) nodes.push({ type: "text", value: source.slice(last) });
  return nodes;
}

/** The text without its markers (for alt text, metadata and search). */
export function toPlainText(source: string): string {
  return parseInline(source)
    .map((node) => node.value)
    .join("");
}

/** True for links that leave the site (they open in a new tab). */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
