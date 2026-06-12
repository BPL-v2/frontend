import type { ObjectiveCreate } from "./objectiveCreate.ts";

export type CreateObjectiveBaseBody =
  | { [key: string]: unknown }
  | ObjectiveCreate;
