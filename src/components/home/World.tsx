import { countries, photos } from "@/content/world";

import { SectionHeading } from "../ui/SectionHeading";
import { CountryExplorer } from "./CountryExplorer";
import { PhotoReel } from "./PhotoReel";

export function World() {
  return (
    <section id="world" aria-labelledby="world-title" className="border-b border-line">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading
          id="world-title"
          eyebrow="Around the world"
          title={`${countries.length} countries, one curious engineer`}
        />
        <p className="mt-3 max-w-[60ch] text-muted">
          Drag the globe to spin it. Hover or tap a country to see what I did there.
        </p>
        <CountryExplorer countries={countries} />
        <PhotoReel photos={photos} />
      </div>
    </section>
  );
}
