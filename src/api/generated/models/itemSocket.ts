import type { ItemSocketAttr } from "./itemSocketAttr.ts";
import type { ItemSocketItem } from "./itemSocketItem.ts";
import type { ItemSocketSColour } from "./itemSocketSColour.ts";
import type { ItemSocketType } from "./itemSocketType.ts";

export interface ItemSocket {
  attr?: ItemSocketAttr;
  group: number;
  item?: ItemSocketItem;
  sColour?: ItemSocketSColour;
  type?: ItemSocketType;
}
