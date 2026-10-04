import type { NonSensitiveUser } from "./nonSensitiveUser.ts";
import type { SignupGroup } from "./signupGroup.ts";

export interface Signup {
  expected_playtime: number;
  extra?: string;
  group?: SignupGroup;
  needs_help?: boolean;
  team_id?: number;
  team_lead: boolean;
  timestamp: Date;
  user: NonSensitiveUser;
  wants_to_help?: boolean;
}
