import type { ApprovalStatus } from "./approvalStatus.ts";

export interface Submission {
  approval_status: ApprovalStatus;
  ascendancy_classes_used?: string[];
  comment: string;
  gems_used?: string[];
  id: number;
  number: number;
  objective_id: number;
  proof: string;
  review_comment?: string;
  reviewer_id?: number;
  team_id: number;
  timestamp: Date;
  user_id: number;
}
