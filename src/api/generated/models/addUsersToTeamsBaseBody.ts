import type { TeamUserCreate } from "./teamUserCreate.ts";

export type AddUsersToTeamsBaseBody =
  { [key: string]: unknown } | TeamUserCreate[];
