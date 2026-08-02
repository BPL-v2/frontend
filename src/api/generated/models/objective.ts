import type { Condition } from "./condition.ts";
import type { CountingMethod } from "./countingMethod.ts";
import type { ObjectiveDetails } from "./objectiveDetails.ts";
import type { ObjectiveType } from "./objectiveType.ts";
import type { ScoringRule } from "./scoringRule.ts";
import type { TrackedValue } from "./trackedValue.ts";

export interface Objective {
  children: Objective[];
  conditions: Condition[];
  counting_method: CountingMethod;
  details?: ObjectiveDetails;
  extra: string;
  hide_progress: boolean;
  id: number;
  name: string;
  objective_type: ObjectiveType;
  parent_id: number;
  required_number: number;
  scoring_rules: ScoringRule[];
  tracked_value: TrackedValue;
  valid_from?: Date;
  valid_to?: Date;
}
