"use client";

import { useEffect, useState } from "react";

/**
 * The id of the section crossing the middle of the viewport, among the elements with the given
 * ids (null until one does, or when none exists on the page).
 */
export function useScrollSpy(ids: readonly string[], rootMargin = "-45% 0px -50% 0px"): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(" ");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = key
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [key, rootMargin]);

  return active;
}
