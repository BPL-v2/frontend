import type { AchievementCheckKey } from "./achievementCheckKey.ts";

export interface AchievementResponse {
  auto_check_key?: AchievementCheckKey;
  description?: string;
  event_id?: number;
  icon_url?: string;
  id?: number;
  is_custom?: boolean;
  name?: string;
}
