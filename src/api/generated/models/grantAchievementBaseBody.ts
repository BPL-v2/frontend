import type { AchievementGrant } from "./achievementGrant.ts";

export type GrantAchievementBaseBody =
  { [key: string]: unknown } | AchievementGrant;
