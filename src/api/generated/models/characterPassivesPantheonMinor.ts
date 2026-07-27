/**
 * PantheonMinor PoE1 only; one of Abberath, Gruthkul, Yugul, Shakari, Tukohama, Ralakesh, Garukhan, or Ryslatha
 */
export type CharacterPassivesPantheonMinor =
  (typeof CharacterPassivesPantheonMinor)[keyof typeof CharacterPassivesPantheonMinor];

export const CharacterPassivesPantheonMinor = {
  Abberath: "Abberath",
  Garukhan: "Garukhan",
  Gruthkul: "Gruthkul",
  Ralakesh: "Ralakesh",
  Ryslatha: "Ryslatha",
  Shakari: "Shakari",
  Tukohama: "Tukohama",
  Yugul: "Yugul",
} as const;
