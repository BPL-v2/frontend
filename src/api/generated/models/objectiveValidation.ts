import type { Item } from "./item.ts";

export interface ObjectiveValidation {
  item: Item;
  objective_id: number;
  timestamp: Date;
}
