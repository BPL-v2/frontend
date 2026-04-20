import type { AchievementCreate } from "./achievementCreate";

export type AddAchievementBaseBody =
  | { [key: string]: unknown }
  | AchievementCreate;
