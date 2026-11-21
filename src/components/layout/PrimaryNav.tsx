"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/content/types";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

interface PrimaryNavProps {
  items: readonly NavItem[];
}

/**
 * The desktop links to the home page's sections. The one in view is underlined; on a project's
 * documentation page, "Projects" is.
 */
export function PrimaryNav({ items }: PrimaryNavProps) {
  const pathname = usePathname();
  const inView = useScrollSpy(items.map((item) => item.id));
  const active = pathname.startsWith("/projects") ? "projects" : pathname === "/" ? inView : null;

  return (
    <div className="hidden items-center gap-6 text-sm text-muted lg:flex">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/#${item.id}`}
          className="navlink relative hover:text-ink"
          aria-current={active === item.id ? "true" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
