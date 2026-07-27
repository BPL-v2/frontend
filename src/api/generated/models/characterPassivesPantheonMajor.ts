/**
 * PantheonMajor PoE1 only; one of TheBrineKing, Arakaali, Solaris, or Lunaris
 */
export type CharacterPassivesPantheonMajor =
  (typeof CharacterPassivesPantheonMajor)[keyof typeof CharacterPassivesPantheonMajor];

export const CharacterPassivesPantheonMajor = {
  Arakaali: "Arakaali",
  Lunaris: "Lunaris",
  Solaris: "Solaris",
  TheBrineKing: "TheBrineKing",
} as const;
