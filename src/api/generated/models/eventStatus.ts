import type { ApplicationStatus } from "./applicationStatus.ts";

export interface EventStatus {
  application_status: ApplicationStatus;
  is_team_lead: boolean;
  number_of_signups: number;
  number_of_signups_before: number;
  team_id?: number;
}
