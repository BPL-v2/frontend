import type { AchievementCreate } from "./achievementCreate.ts";

export type CreateAchievementBaseBody =
  | { [key: string]: unknown }
  | AchievementCreate;
