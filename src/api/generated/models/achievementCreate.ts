import type { AchievementName } from "./achievementName";

export interface AchievementCreate {
  name: AchievementName;
  user_id: number;
}
