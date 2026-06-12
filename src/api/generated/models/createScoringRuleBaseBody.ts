import type { ScoringRuleCreate } from "./scoringRuleCreate.ts";

export type CreateScoringRuleBaseBody =
  | { [key: string]: unknown }
  | ScoringRuleCreate;
