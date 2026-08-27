import type { ItemField } from "./itemField.ts";

export interface ItemWish {
  build_enabling: boolean;
  extra?: string;
  fulfilled: boolean;
  id: number;
  item_field: ItemField;
  priority: number;
  quantity: number;
  user_id: number;
  value: string;
}
