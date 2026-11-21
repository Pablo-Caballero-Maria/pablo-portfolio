"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import type { NavItem } from "@/content/types";

import { Menu } from "lucide-react";

interface MobileMenuProps {
  items: readonly NavItem[];
}

/** The menu button for narrow screens and the panel of links it opens under the header. */
export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface lg:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <Menu className="h-4 w-4" />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-y border-line bg-bg px-4 pb-4 shadow-lg lg:hidden"
      >
        <div className="grid grid-cols-2 gap-2 pt-3 text-sm">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              className={`rounded-md bg-surface px-3 py-2 ${index === items.length - 1 && items.length % 2 === 1 ? "col-span-2" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
