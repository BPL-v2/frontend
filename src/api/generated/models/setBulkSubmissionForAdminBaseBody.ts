import type { TeamSubmissionCreate } from "./teamSubmissionCreate.ts";

export type SetBulkSubmissionForAdminBaseBody =
  { [key: string]: unknown } | TeamSubmissionCreate;
