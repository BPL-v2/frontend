import type { SubmissionReview } from "./submissionReview.ts";

export type ReviewSubmissionBaseBody =
  { [key: string]: unknown } | SubmissionReview;
