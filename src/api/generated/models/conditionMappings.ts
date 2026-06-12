import type { ConditionMappingsFieldToType } from "./conditionMappingsFieldToType.ts";
import type { ConditionMappingsObjectiveTypeToTrackedValues } from "./conditionMappingsObjectiveTypeToTrackedValues.ts";
import type { ConditionMappingsValidOperators } from "./conditionMappingsValidOperators.ts";

export interface ConditionMappings {
  field_to_type: ConditionMappingsFieldToType;
  objective_type_to_tracked_values: ConditionMappingsObjectiveTypeToTrackedValues;
  valid_operators: ConditionMappingsValidOperators;
}
