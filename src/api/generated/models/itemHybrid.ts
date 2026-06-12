import type { ItemProperty } from "./itemProperty.ts";

export interface ItemHybrid {
  baseTypeName?: string;
  explicitMods?: string[];
  isVaalGem?: boolean;
  properties?: ItemProperty[];
  secDescrText?: string;
}
