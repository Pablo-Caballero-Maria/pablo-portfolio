interface TagListProps {
  tags: readonly string[];
  label?: string;
  className?: string;
}

/** A row of small outlined mono tags (technologies, topics). */
export function TagList({ tags, label, className = "" }: TagListProps) {
  return (
    <ul className={`flex flex-wrap gap-1.5 font-mono text-[11px] ${className}`} aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className="rounded border border-line px-2 py-0.5">
          {tag}
        </li>
      ))}
    </ul>
  );
}
