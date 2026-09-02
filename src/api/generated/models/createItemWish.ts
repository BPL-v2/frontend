import type { ItemField } from "./itemField.ts";

export interface CreateItemWish {
  build_enabling: number;
  extra?: string;
  item_field: ItemField;
  quantity?: number;
  value: string;
}
