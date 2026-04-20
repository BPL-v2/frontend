import type { ItemSocketItem } from './itemSocketItem';
import type { ItemSocketType } from './itemSocketType';

export interface ItemSocket {
  attr?: string;
  group?: number;
  item?: ItemSocketItem;
  sColour?: string;
  type?: ItemSocketType;
}
