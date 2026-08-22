import type { TeamSheetEntryUpdate } from "./teamSheetEntryUpdate.ts";

export type SaveMyTeamSheetEntryBaseBody =
  { [key: string]: unknown } | TeamSheetEntryUpdate;
