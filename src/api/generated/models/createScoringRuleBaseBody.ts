import type { ScoringRuleCreate } from "./scoringRuleCreate";

export type CreateScoringRuleBaseBody =
  | { [key: string]: unknown }
  | ScoringRuleCreate;
