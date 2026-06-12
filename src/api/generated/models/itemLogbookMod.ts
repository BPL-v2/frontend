import type { ItemLogbookModFaction } from "./itemLogbookModFaction.ts";

export interface ItemLogbookMod {
  faction?: ItemLogbookModFaction;
  mods?: string[];
  name?: string;
}
