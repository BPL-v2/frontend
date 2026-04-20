import type { ItemJewelDataSubgraph } from './itemJewelDataSubgraph';

export interface ItemJewelData {
  radius?: number;
  radiusMin?: number;
  radiusVisual?: string;
  subgraph?: ItemJewelDataSubgraph;
  type?: string;
}
