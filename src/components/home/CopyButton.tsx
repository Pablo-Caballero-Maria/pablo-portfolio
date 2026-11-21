"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  text: string;
  /** What is copied, read after "Copy" by screen readers ("email address"). */
  what: string;
  className?: string;
  style?: CSSProperties;
}

type Status = "idle" | "copied" | "failed";

const RESET_AFTER_MS = 1600;
const MESSAGES: Record<Status, string> = { idle: "Copy", copied: "Copied", failed: "Couldn't copy" };

/**
 * Copies `text` to the clipboard and confirms it (visibly and to screen readers). Where the
 * Clipboard API is missing or refused it says so; the text itself stays selectable.
 */
export function CopyButton({ text, what, className = "", style }: CopyButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let next: Status = "copied";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      next = "failed";
    }
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), RESET_AFTER_MS);
  }

  return (
    <>
      <button type="button" onClick={copy} className={className} style={style}>
        {MESSAGES[status]}
        {status === "idle" && (
          <>
            {" "}
            <span className="sr-only">{what}</span>
          </>
        )}
      </button>
      <span role="status" className="sr-only">
        {status === "copied"
          ? `${what} copied to the clipboard`
          : status === "failed"
            ? `Couldn't copy the ${what}`
            : ""}
      </span>
    </>
  );
}
