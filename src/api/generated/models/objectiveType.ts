export type ObjectiveType = (typeof ObjectiveType)[keyof typeof ObjectiveType];

export const ObjectiveType = {
  ITEM: "ITEM",
  PLAYER: "PLAYER",
  TEAM: "TEAM",
  SUBMISSION: "SUBMISSION",
  CATEGORY: "CATEGORY",
} as const;
