import type { TeamSubmissionCreate } from "./teamSubmissionCreate";

export type SetBulkSubmissionForAdminBaseBody =
  | { [key: string]: unknown }
  | TeamSubmissionCreate;
