import type { ApplicationStatus } from "./applicationStatus";

export interface EventStatus {
  application_status: ApplicationStatus;
  is_team_lead: boolean;
  number_of_signups: number;
  number_of_signups_before: number;
  partner_wish?: string;
  team_id?: number;
  users_who_want_to_sign_up_with_you?: string[];
}
