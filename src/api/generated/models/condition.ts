import type { ItemField } from "./itemField.ts";
import type { Operator } from "./operator.ts";

export interface Condition {
  field: ItemField;
  operator: Operator;
  value: string;
}
