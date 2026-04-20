export type Action = (typeof Action)[keyof typeof Action];

export const Action = {
  added: "added",
  modified: "modified",
  removed: "removed",
} as const;
