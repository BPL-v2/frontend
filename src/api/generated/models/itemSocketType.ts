/**
 * Type PoE2 only; gem, jewel, or rune
 */
export type ItemSocketType =
  (typeof ItemSocketType)[keyof typeof ItemSocketType];

export const ItemSocketType = {
  gem: "gem",
  jewel: "jewel",
  rune: "rune",
} as const;
