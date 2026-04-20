import type { ConditionMappingsFieldToType } from "./conditionMappingsFieldToType";
import type { ConditionMappingsObjectiveTypeToNumberFields } from "./conditionMappingsObjectiveTypeToNumberFields";
import type { ConditionMappingsValidOperators } from "./conditionMappingsValidOperators";

export interface ConditionMappings {
  field_to_type: ConditionMappingsFieldToType;
  objective_type_to_number_fields: ConditionMappingsObjectiveTypeToNumberFields;
  valid_operators: ConditionMappingsValidOperators;
}
