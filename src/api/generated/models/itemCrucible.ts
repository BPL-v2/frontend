import type { ItemCrucibleNodes } from "./itemCrucibleNodes.ts";

export interface ItemCrucible {
  /** Layout URL to an image of the tree layout */
  layout: string;
  /** Nodes the key is the string value of the node index */
  nodes: ItemCrucibleNodes;
}
