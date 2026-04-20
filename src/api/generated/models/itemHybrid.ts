import type { ItemProperty } from './itemProperty';

export interface ItemHybrid {
  baseTypeName?: string;
  explicitMods?: string[];
  isVaalGem?: boolean;
  properties?: ItemProperty[];
  secDescrText?: string;
}
