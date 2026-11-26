"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  type ContactInput,
  type ContactMessage,
  EMPTY_CONTACT,
  MESSAGE_MAX,
  contactMailto,
  contactSchema,
  openMailto,
} from "@/lib/contact";
import { rise } from "@/lib/motion";

interface ContactFormProps {
  /** Where the message goes. */
  to: string;
  /** Opens the prepared e-mail (the browser's mailto: handling; replaced in the tests). */
  send?: (href: string) => void;
}

// The section is drawn in the inverted colours (text in --bg on --ink), in both themes.
const field =
  "mt-1 w-full rounded-md border border-[color-mix(in_srgb,var(--bg)_30%,var(--ink))] bg-transparent px-3 py-2 font-normal text-bg focus:outline-2 focus:outline-offset-2 focus:outline-bg aria-invalid:border-[color-mix(in_srgb,var(--warm)_45%,var(--bg))]";
const error = "mt-1 block font-normal text-[color-mix(in_srgb,var(--warm)_45%,var(--bg))]";

/**
 * "Write to me": react-hook-form keeps the fields and zod (src/lib/contact.ts) checks them; a valid
 * message opens the visitor's e-mail app ready to send, as the site has no server to send it.
 */
export function ContactForm({ to, send = openMailto }: ContactFormProps) {
  const id = useId();
  const [opened, setOpened] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactMessage>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY_CONTACT,
    mode: "onTouched",
  });
  const length = useWatch({ control, name: "message" }).length;

  function submit(message: ContactMessage) {
    send(contactMailto(to, message));
    setOpened(true);
  }

  const errorId = (name: keyof ContactInput) => `${id}-${name}-error`;
  const describe = (name: keyof ContactInput) => (errors[name] ? errorId(name) : undefined);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      aria-labelledby={`${id}-title`}
      className="grid gap-4 rounded-xl bg-[color-mix(in_srgb,var(--bg)_8%,var(--ink))] p-5 sm:grid-cols-2 md:col-span-2"
    >
      <h3 id={`${id}-title`} className="font-display text-xl font-bold sm:col-span-2">
        Write to me
      </h3>
      <label className="text-sm font-semibold">
        Name
        <input
          {...register("name")}
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describe("name")}
          className={field}
        />
        <FieldError id={errorId("name")} message={errors.name?.message} />
      </label>
      <label className="text-sm font-semibold">
        Organisation <span className="font-normal opacity-70">(optional)</span>
        <input
          {...register("organisation")}
          autoComplete="organization"
          aria-invalid={errors.organisation ? true : undefined}
          aria-describedby={describe("organisation")}
          className={field}
        />
        <FieldError id={errorId("organisation")} message={errors.organisation?.message} />
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        Message
        <textarea
          {...register("message")}
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={`${id}-count${errors.message ? ` ${errorId("message")}` : ""}`}
          className={`${field} resize-y`}
        />
        <span id={`${id}-count`} className="mt-1 block text-right font-mono text-xs font-normal opacity-70">
          {length}/{MESSAGE_MAX}
        </span>
        <FieldError id={errorId("message")} message={errors.message?.message} />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-bg px-5 py-2.5 font-semibold text-ink hover:opacity-90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          Open in my e-mail app
        </button>
        <p role="status" className="text-sm text-[color-mix(in_srgb,var(--bg)_75%,var(--ink))]">
          <AnimatePresence mode="wait" initial={false}>
            <m.span key={String(opened)} {...rise} className="block">
              {opened
                ? "Your e-mail app should now be open with the message ready to send. If it isn't, copy the address above."
                : "Nothing is sent from this page: your e-mail app opens with the message, ready for you to send."}
            </m.span>
          </AnimatePresence>
        </p>
      </div>
    </form>
  );
}

/** A field's error, which slides in when it appears. */
function FieldError({ id, message }: { id: string; message: string | undefined }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <m.span key="error" id={id} {...rise} className={error}>
          {message}
        </m.span>
      )}
    </AnimatePresence>
  );
}
