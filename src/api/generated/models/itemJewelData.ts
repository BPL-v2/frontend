import type { ItemJewelDataSubgraph } from "./itemJewelDataSubgraph.ts";

export interface ItemJewelData {
  radius?: number;
  radiusMin?: number;
  radiusVisual?: string;
  subgraph?: ItemJewelDataSubgraph;
  type: string;
}
