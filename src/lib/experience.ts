import type { ExperienceCategory, ExperienceItem } from "@/content/types";

/** How many items each experience filter shows ("all" counts everything). */
export function countByCategory(
  items: readonly ExperienceItem[],
): Record<"all" | ExperienceCategory, number> {
  return {
    all: items.length,
    tech: items.filter((item) => item.category === "tech").length,
    vol: items.filter((item) => item.category === "vol").length,
  };
}
