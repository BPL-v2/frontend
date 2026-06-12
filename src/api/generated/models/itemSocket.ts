import type { ItemSocketItem } from "./itemSocketItem.ts";
import type { ItemSocketType } from "./itemSocketType.ts";

export interface ItemSocket {
  attr?: string;
  group?: number;
  item?: ItemSocketItem;
  sColour?: string;
  type?: ItemSocketType;
}
