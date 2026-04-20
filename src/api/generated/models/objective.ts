import type { AggregationType } from "./aggregationType";
import type { Condition } from "./condition";
import type { NumberField } from "./numberField";
import type { ObjectiveType } from "./objectiveType";
import type { ScoringPreset } from "./scoringPreset";

export interface Objective {
  aggregation: AggregationType;
  children: Objective[];
  conditions: Condition[];
  extra: string;
  hide_progress: boolean;
  id: number;
  name: string;
  number_field: NumberField;
  number_field_explanation?: string;
  objective_type: ObjectiveType;
  parent_id: number;
  required_number: number;
  scoring_presets: ScoringPreset[];
  valid_from?: Date;
  valid_to?: Date;
}
