import type { NonSensitiveUser } from "./nonSensitiveUser";

export interface Signup {
  expected_playtime: number;
  extra?: string;
  needs_help?: boolean;
  partner?: NonSensitiveUser;
  partnerWish?: string;
  partner_id?: number;
  team_id?: number;
  team_lead: boolean;
  timestamp: Date;
  user: NonSensitiveUser;
  wants_to_help?: boolean;
}
