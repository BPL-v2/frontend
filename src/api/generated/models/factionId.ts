/**
 * Id Faction1, Faction2, Faction3, or Faction4
 */
export type FactionId = (typeof FactionId)[keyof typeof FactionId];

export const FactionId = {
  Faction1: "Faction1",
  Faction2: "Faction2",
  Faction3: "Faction3",
  Faction4: "Faction4",
} as const;
