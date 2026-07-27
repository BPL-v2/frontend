/**
 * Rarity Normal, Magic, Rare, or Unique
 */
export type ItemRarity = (typeof ItemRarity)[keyof typeof ItemRarity];

export const ItemRarity = {
  Magic: "Magic",
  Normal: "Normal",
  Rare: "Rare",
  Unique: "Unique",
} as const;
