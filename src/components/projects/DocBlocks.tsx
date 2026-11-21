import Image from "next/image";

import type { DocBlock, DocSection } from "@/content/projects";

import { RichText } from "../ui/RichText";

function Block({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p>
          <RichText text={block.text} linkClassName="" />
        </p>
      );

    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, index) => (
            <li key={index} className="relative pl-5">
              <span
                className="absolute top-[0.6em] left-0 h-1.5 w-1.5 rounded-full bg-project"
                aria-hidden="true"
              />
              <RichText text={item} linkClassName="" />
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((item, index) => (
            <li key={index} className="grid grid-cols-[2rem_1fr] gap-3">
              <span
                className="num grid h-7 w-7 place-items-center rounded-full border border-project font-mono text-xs font-medium text-project"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="pt-0.5">
                <RichText text={item} linkClassName="" />
              </span>
            </li>
          ))}
        </ol>
      );

    case "figure":
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-xl border border-line bg-white p-2 sm:p-3">
            <Image
              src={block.figure.src}
              alt={block.figure.alt}
              width={block.figure.width}
              height={block.figure.height}
              sizes="(min-width: 1024px) 46rem, 100vw"
              className="h-auto w-full rounded-md"
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted">
            <RichText text={block.figure.caption} linkClassName="" />
          </figcaption>
        </figure>
      );

    case "code":
      return (
        <figure className="my-6">
          <pre
            className="overflow-x-auto rounded-xl border border-line bg-raised p-4 font-mono text-[13px] leading-relaxed"
            tabIndex={0}
            aria-label={block.caption ?? `${block.language} code`}
          >
            <code data-language={block.language}>{block.code}</code>
          </pre>
          {block.caption && <figcaption className="mt-2 text-sm text-muted">{block.caption}</figcaption>}
        </figure>
      );

    case "table":
      return (
        <figure className="my-6">
          <div
            className="overflow-x-auto rounded-xl border border-line"
            tabIndex={0}
            role="region"
            aria-label={block.caption ?? "Table"}
          >
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-raised font-mono text-[11px] tracking-wider text-muted uppercase">
                <tr>
                  {block.head.map((cell) => (
                    <th key={cell} scope="col" className="px-4 py-2.5 font-medium">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join("|")} className="border-t border-line align-top">
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={index} scope="row" className="px-4 py-2.5 font-semibold">
                          {cell}
                        </th>
                      ) : (
                        <td key={index} className="num px-4 py-2.5">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="mt-2 text-sm text-muted">{block.caption}</figcaption>}
        </figure>
      );

    case "callout":
      return (
        <aside className="my-6 rounded-xl border border-line border-l-4 border-l-project bg-surface p-5">
          <p className="font-display font-bold">{block.title}</p>
          <p className="mt-1.5 text-muted">
            <RichText text={block.text} linkClassName="" />
          </p>
        </aside>
      );
  }
}

/** A documentation section: an anchored heading and its blocks. */
export function DocSectionView({ section }: { section: DocSection }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24">
      <h2 id={`${section.id}-title`} className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {section.title}
      </h2>
      <div className="prose-doc mt-5 space-y-4 text-[17px] leading-relaxed">
        {section.blocks.map((block, index) => (
          <Block key={`${block.kind}-${index}`} block={block} />
        ))}
      </div>
    </section>
  );
}
