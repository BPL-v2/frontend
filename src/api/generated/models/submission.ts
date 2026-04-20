import type { ApprovalStatus } from "./approvalStatus";

export interface Submission {
  approval_status: ApprovalStatus;
  comment: string;
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
