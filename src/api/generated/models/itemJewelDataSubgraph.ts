import type { ItemJewelDataSubgraphGroups } from "./itemJewelDataSubgraphGroups.ts";
import type { ItemJewelDataSubgraphNodes } from "./itemJewelDataSubgraphNodes.ts";

/**
 * Subgraph only present on cluster jewels
 */
export interface ItemJewelDataSubgraph {
  /** Groups the key is the string value of the group id */
  groups: ItemJewelDataSubgraphGroups;
  /** Nodes the key is the string value of the node identifier */
  nodes: ItemJewelDataSubgraphNodes;
}
