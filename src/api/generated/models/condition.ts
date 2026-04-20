import type { ItemField } from "./itemField";
import type { Operator } from "./operator";

export interface Condition {
  field: ItemField;
  operator: Operator;
  value: string;
}
