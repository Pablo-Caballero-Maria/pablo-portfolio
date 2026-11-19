/** Renders a string written with the inline markup of src/lib/rich-text.ts. */
import Link from "next/link";

import { isExternalHref, parseInline } from "@/lib/rich-text";

interface RichTextProps {
  text: string;
  /** Classes for links (defaults to the accent colour, underlined on hover). */
  linkClassName?: string;
}

export function RichText({
  text,
  linkClassName = "font-semibold text-accent hover:underline",
}: RichTextProps) {
  return parseInline(text).map((node, index) => {
    switch (node.type) {
      case "text":
        return node.value;
      case "strong":
        return (
          <strong key={index} className="font-semibold text-ink">
            {node.value}
          </strong>
        );
      case "em":
        return <em key={index}>{node.value}</em>;
      case "code":
        return <code key={index}>{node.value}</code>;
      case "link":
        return isExternalHref(node.href) ? (
          <a key={index} className={linkClassName} href={node.href} target="_blank" rel="noopener noreferrer">
            {node.value}
          </a>
        ) : (
          <Link key={index} className={linkClassName} href={node.href}>
            {node.value}
          </Link>
        );
    }
  });
}
