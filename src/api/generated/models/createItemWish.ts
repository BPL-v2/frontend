import type { ItemField } from "./itemField.ts";

export interface CreateItemWish {
  build_enabling?: boolean;
  extra?: string;
  item_field: ItemField;
  quantity?: number;
  value: string;
}
