import type { ScoringRuleCreateExtra } from "./scoringRuleCreateExtra.ts";
import type { ScoringRuleType } from "./scoringRuleType.ts";

export interface ScoringRuleCreate {
  description?: string;
  extra?: ScoringRuleCreateExtra;
  id?: number;
  name: string;
  point_cap?: number;
  points: number[];
  scoring_rule: ScoringRuleType;
}
