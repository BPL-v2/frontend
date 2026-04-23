import type { ConditionMappingsFieldToType } from "./conditionMappingsFieldToType";
import type { ConditionMappingsObjectiveTypeToTrackedValues } from "./conditionMappingsObjectiveTypeToTrackedValues";
import type { ConditionMappingsValidOperators } from "./conditionMappingsValidOperators";

export interface ConditionMappings {
  field_to_type: ConditionMappingsFieldToType;
  objective_type_to_tracked_values: ConditionMappingsObjectiveTypeToTrackedValues;
  valid_operators: ConditionMappingsValidOperators;
}
