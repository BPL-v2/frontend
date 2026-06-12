import type { AchievementCreate } from "./achievementCreate.ts";

export type UpdateAchievementBaseBody =
  | { [key: string]: unknown }
  | AchievementCreate;
