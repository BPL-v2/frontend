import type { ApprovalStatus } from './approvalStatus';

export interface SubmissionReview {
  approval_status: ApprovalStatus;
  review_comment?: string;
}
