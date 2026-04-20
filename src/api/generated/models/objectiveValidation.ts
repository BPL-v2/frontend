import type { Item } from './item';

export interface ObjectiveValidation {
  item: Item;
  objective_id: number;
  timestamp: Date;
}
