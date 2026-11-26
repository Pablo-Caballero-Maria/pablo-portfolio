import { describe, expect, it } from "vitest";
import { z } from "@/lib/zod";

import { EMPTY_CONTACT, MESSAGE_MAX, contactMailto, contactSchema } from "@/lib/contact";

const message = "Hello Pablo, I'd like to talk about a research position in our lab.";

describe("contactSchema", () => {
  it("accepts a complete message and trims it", () => {
    expect(contactSchema.parse({ name: "  Ada  ", organisation: " ", message: ` ${message} ` })).toEqual({
      name: "Ada",
      organisation: "",
      message,
    });
  });

  it("explains what is missing or too long", () => {
    const result = contactSchema.safeParse(EMPTY_CONTACT);
    expect(result.success).toBe(false);
    const errors = z.flattenError(result.error!).fieldErrors;
    expect(errors.name).toEqual(["Please tell me your name."]);
    expect(errors.message).toEqual(["Please write at least a couple of sentences."]);
    expect(errors.organisation).toBeUndefined();

    const long = contactSchema.safeParse({
      name: "Ada",
      organisation: "",
      message: "x".repeat(MESSAGE_MAX + 1),
    });
    expect(z.flattenError(long.error!).fieldErrors.message).toEqual([
      `Please keep it under ${MESSAGE_MAX} characters.`,
    ]);
  });
});

describe("contactMailto", () => {
  it("addresses the e-mail with the subject and the signed message", () => {
    const href = contactMailto("me@example.org", { name: "Ada", organisation: "IMIBIC", message });
    expect(href.startsWith("mailto:me@example.org?")).toBe(true);
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("subject")).toBe("Portfolio contact — Ada (IMIBIC)");
    expect(params.get("body")).toBe(`${message}\n\nAda (IMIBIC)`);
    // Spaces as %20, not "+", which mail apps would show as is.
    expect(href).not.toContain("+");
  });

  it("signs with the name alone without an organisation", () => {
    const href = contactMailto("me@example.org", { name: "Ada", organisation: "", message });
    expect(new URLSearchParams(href.split("?")[1]).get("subject")).toBe("Portfolio contact — Ada");
  });
});
