import type { ScoringRuleExtra } from "./scoringRuleExtra";
import type { ScoringRuleType } from "./scoringRuleType";

export interface ScoringRule {
  description: string;
  extra?: ScoringRuleExtra;
  id: number;
  name: string;
  point_cap?: number;
  points: number[];
  scoring_rule: ScoringRuleType;
}
