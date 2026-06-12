import type { ApprovalStatus } from "./approvalStatus.ts";

export interface SubmissionReview {
  approval_status: ApprovalStatus;
  review_comment?: string;
}
