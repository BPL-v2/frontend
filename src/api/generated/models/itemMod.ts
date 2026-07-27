import type { ItemModFlags } from "./itemModFlags.ts";

export interface ItemMod {
  description: string;
  flags?: ItemModFlags;
}
