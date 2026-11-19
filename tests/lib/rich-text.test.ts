import { describe, expect, it } from "vitest";

import { isExternalHref, parseInline, toPlainText } from "@/lib/rich-text";

describe("parseInline", () => {
  it("returns plain text as a single node", () => {
    expect(parseInline("Just text.")).toEqual([{ type: "text", value: "Just text." }]);
  });

  it("returns nothing for an empty string", () => {
    expect(parseInline("")).toEqual([]);
  });

  it("parses bold, emphasis, code and links in order", () => {
    expect(parseInline("A **bold** and *soft* `code` [site](https://example.com)!")).toEqual([
      { type: "text", value: "A " },
      { type: "strong", value: "bold" },
      { type: "text", value: " and " },
      { type: "em", value: "soft" },
      { type: "text", value: " " },
      { type: "code", value: "code" },
      { type: "text", value: " " },
      { type: "link", value: "site", href: "https://example.com" },
      { type: "text", value: "!" },
    ]);
  });

  it("prefers ** over * so bold isn't read as two emphases", () => {
    expect(parseInline("**x**")).toEqual([{ type: "strong", value: "x" }]);
  });

  it("keeps incomplete markers as text", () => {
    expect(parseInline("2 * 3 = 6 and a lone ` tick")).toEqual([
      { type: "text", value: "2 * 3 = 6 and a lone ` tick" },
    ]);
  });

  it("doesn't format inside code", () => {
    expect(parseInline("`**not bold**`")).toEqual([{ type: "code", value: "**not bold**" }]);
  });

  it("keeps link labels with symbols", () => {
    expect(parseInline("[3TR project ↗](https://3tr-imi.eu/)")).toEqual([
      { type: "link", value: "3TR project ↗", href: "https://3tr-imi.eu/" },
    ]);
  });
});

describe("toPlainText", () => {
  it("drops the markers but keeps the words", () => {
    expect(toPlainText("**Bold** and [a link](https://x.y) with `code`")).toBe("Bold and a link with code");
  });
});

describe("isExternalHref", () => {
  it.each([
    ["https://example.com", true],
    ["http://example.com", true],
    ["/projects/piano", false],
    ["#world", false],
    ["mailto:a@b.c", false],
  ])("%s → %s", (href, expected) => {
    expect(isExternalHref(href)).toBe(expected);
  });
});
