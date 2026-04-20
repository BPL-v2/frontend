export type GameVersion = (typeof GameVersion)[keyof typeof GameVersion];

export const GameVersion = {
  poe1: "poe1",
  poe2: "poe2",
} as const;
