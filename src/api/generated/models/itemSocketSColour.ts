/**
 * SColour PoE1 only; R, G, B, W, A, or DV
 */
export type ItemSocketSColour =
  (typeof ItemSocketSColour)[keyof typeof ItemSocketSColour];

export const ItemSocketSColour = {
  A: "A",
  B: "B",
  DV: "DV",
  G: "G",
  R: "R",
  W: "W",
} as const;
