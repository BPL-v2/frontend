import type { ItemField } from "./itemField.ts";

export interface ItemWish {
  build_enabling: boolean;
  fulfilled: boolean;
  id: number;
  item_field: ItemField;
  priority: number;
  user_id: number;
  value: string;
}
