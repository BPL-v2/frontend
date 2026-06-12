import type { TeamCreate } from "./teamCreate.ts";

export type CreateTeamBaseBody = { [key: string]: unknown } | TeamCreate;
