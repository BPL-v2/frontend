import type { Condition } from "./condition";
import type { CountingMethod } from "./countingMethod";
import type { ObjectiveType } from "./objectiveType";
import type { TrackedValue } from "./trackedValue";

export interface ObjectiveCreate {
  conditions: Condition[];
  counting_method: CountingMethod;
  extra?: string;
  hide_progress?: boolean;
  id?: number;
  name: string;
  objective_type: ObjectiveType;
  parent_id: number;
  required_number: number;
  scoring_rule_ids: number[];
  tracked_value: TrackedValue;
  tracked_value_explanation?: string;
  valid_from?: Date;
  valid_to?: Date;
}
