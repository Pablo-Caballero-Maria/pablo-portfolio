/** Wraps an index into [0, length), so stepping past either end of a list loops around. */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

/** "07 / 16": a 1-based, zero-padded position in a list. */
export function formatPosition(index: number, length: number): string {
  const width = String(length).length;
  return `${String(index + 1).padStart(Math.max(2, width), "0")} / ${length}`;
}
