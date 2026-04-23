import type { Condition } from "./condition";
import type { CountingMethod } from "./countingMethod";
import type { ObjectiveType } from "./objectiveType";
import type { ScoringRule } from "./scoringRule";
import type { TrackedValue } from "./trackedValue";

export interface Objective {
  children: Objective[];
  conditions: Condition[];
  counting_method: CountingMethod;
  extra: string;
  hide_progress: boolean;
  id: number;
  name: string;
  objective_type: ObjectiveType;
  parent_id: number;
  required_number: number;
  scoring_rules: ScoringRule[];
  tracked_value: TrackedValue;
  tracked_value_explanation?: string;
  valid_from?: Date;
  valid_to?: Date;
}
