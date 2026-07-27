/**
 * Colour PoE1 only; S, D, I, or G
 */
export type ItemColour = (typeof ItemColour)[keyof typeof ItemColour];

export const ItemColour = {
  D: "D",
  G: "G",
  I: "I",
  S: "S",
} as const;
