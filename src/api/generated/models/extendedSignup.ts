import type { ExtendedSignupAtlasMilestonesInLastEvents } from "./extendedSignupAtlasMilestonesInLastEvents.ts";
import type { ExtendedSignupHighestCharacterLevels } from "./extendedSignupHighestCharacterLevels.ts";
import type { ExtendedSignupPlaytimesInLastEventsPerDayInHours } from "./extendedSignupPlaytimesInLastEventsPerDayInHours.ts";
import type { NonSensitiveUser } from "./nonSensitiveUser.ts";

export interface ExtendedSignup {
  /**
   * AtlasMilestonesInLastEvents holds, per recent event with atlas history, how many hours the player
   * was actively playing before reaching 1 and 80 atlas points.
   */
  atlas_milestones_in_last_events: ExtendedSignupAtlasMilestonesInLastEvents;
  expected_playtime: number;
  extra?: string;
  group_key?: string;
  highest_character_levels: ExtendedSignupHighestCharacterLevels;
  needs_help?: boolean;
  playtimes_in_last_events_per_day_in_hours: ExtendedSignupPlaytimesInLastEventsPerDayInHours;
  team_id?: number;
  team_lead: boolean;
  timestamp: Date;
  user: NonSensitiveUser;
  wants_to_help?: boolean;
}
