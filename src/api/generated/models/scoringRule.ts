import type { ScoringRuleExtra } from "./scoringRuleExtra.ts";
import type { ScoringRuleType } from "./scoringRuleType.ts";

export interface ScoringRule {
  description: string;
  extra?: ScoringRuleExtra;
  id: number;
  name: string;
  point_cap?: number;
  points: number[];
  scoring_rule: ScoringRuleType;
}
