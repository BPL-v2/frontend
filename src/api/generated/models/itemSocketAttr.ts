/**
 * Attr PoE1 only; S, D, I, G, A, or DV
 */
export type ItemSocketAttr =
  (typeof ItemSocketAttr)[keyof typeof ItemSocketAttr];

export const ItemSocketAttr = {
  A: "A",
  D: "D",
  DV: "DV",
  G: "G",
  I: "I",
  S: "S",
} as const;
