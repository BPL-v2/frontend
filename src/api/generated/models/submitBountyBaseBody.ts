import type { SubmissionCreate } from "./submissionCreate.ts";

export type SubmitBountyBaseBody =
  | { [key: string]: unknown }
  | SubmissionCreate;
