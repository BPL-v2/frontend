import type { ItemField } from './itemField';

export interface CreateItemWish {
  build_enabling?: boolean;
  item_field: ItemField;
  value: string;
}
