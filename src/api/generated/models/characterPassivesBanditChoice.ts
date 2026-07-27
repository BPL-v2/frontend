/**
 * BanditChoice PoE1 only; one of Kraityn, Alira, Oak, or Eramir
 */
export type CharacterPassivesBanditChoice =
  (typeof CharacterPassivesBanditChoice)[keyof typeof CharacterPassivesBanditChoice];

export const CharacterPassivesBanditChoice = {
  Alira: "Alira",
  Eramir: "Eramir",
  Kraityn: "Kraityn",
  Oak: "Oak",
} as const;
