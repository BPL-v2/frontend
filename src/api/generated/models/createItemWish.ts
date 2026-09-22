import type { ItemField } from "./itemField.ts";

export interface CreateItemWish {
  /**
   * @minimum 1
   * @maximum 5
   */
  build_enabling: number;
  extra?: string;
  item_field: ItemField;
  /**
   * @minimum 1
   * @maximum 5
   */
  quantity: number;
  value: string;
}
