import type { ExtendedSignupHighestCharacterLevels } from "./extendedSignupHighestCharacterLevels.ts";
import type { ExtendedSignupPlaytimesInLastEventsPerDayInHours } from "./extendedSignupPlaytimesInLastEventsPerDayInHours.ts";
import type { NonSensitiveUser } from "./nonSensitiveUser.ts";

export interface ExtendedSignup {
  expected_playtime: number;
  extra?: string;
  highest_character_levels: ExtendedSignupHighestCharacterLevels;
  needs_help?: boolean;
  partner?: NonSensitiveUser;
  partnerWish?: string;
  partner_id?: number;
  playtimes_in_last_events_per_day_in_hours: ExtendedSignupPlaytimesInLastEventsPerDayInHours;
  team_id?: number;
  team_lead: boolean;
  timestamp: Date;
  user: NonSensitiveUser;
  wants_to_help?: boolean;
}
