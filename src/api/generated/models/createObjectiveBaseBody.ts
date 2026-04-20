import type { ObjectiveCreate } from "./objectiveCreate";

export type CreateObjectiveBaseBody =
  | { [key: string]: unknown }
  | ObjectiveCreate;
