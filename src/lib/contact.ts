/**
 * The contact form's rules (zod) and the e-mail it prepares. The site has no server, so the form
 * doesn't send anything itself: it opens the visitor's e-mail app with the message already
 * written, addressed to Pablo, for them to send.
 */
import { z } from "@/lib/zod";

/** Long enough for a real message, short enough for every e-mail app's mailto: limit. */
export const MESSAGE_MAX = 1500;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell me your name.").max(80, "That name is too long."),
  organisation: z.string().trim().max(120, "That name is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least a couple of sentences.")
    .max(MESSAGE_MAX, `Please keep it under ${MESSAGE_MAX} characters.`),
});

/** What the fields hold while typing. */
export type ContactInput = z.input<typeof contactSchema>;
/** What a valid form gives (trimmed). */
export type ContactMessage = z.output<typeof contactSchema>;

export const EMPTY_CONTACT: ContactInput = { name: "", organisation: "", message: "" };

/** The mailto: link that opens the visitor's e-mail app with the message ready. */
export function contactMailto(to: string, { name, organisation, message }: ContactMessage): string {
  const from = organisation ? `${name} (${organisation})` : name;
  const params = new URLSearchParams({
    subject: `Portfolio contact — ${from}`,
    body: `${message}\n\n${from}`,
  });
  // URLSearchParams writes spaces as "+", which mail apps show literally: mailto wants %20.
  return `mailto:${to}?${params.toString().replaceAll("+", "%20")}`;
}

/** Hands a mailto: link to the browser, which passes it to the e-mail app. */
export function openMailto(href: string): void {
  window.location.href = href;
}
