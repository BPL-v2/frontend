export type ObjectiveType = (typeof ObjectiveType)[keyof typeof ObjectiveType];

export const ObjectiveType = {
  ITEM: "ITEM",
  STASH_TAB: "STASH_TAB",
  PLAYER: "PLAYER",
  TEAM: "TEAM",
  SUBMISSION: "SUBMISSION",
  CATEGORY: "CATEGORY",
} as const;
