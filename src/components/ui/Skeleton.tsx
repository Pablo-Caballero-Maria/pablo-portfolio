/** A placeholder with the shape of what is loading (a skeleton loader): a softly pulsing block. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-raised ${className}`} />;
}
