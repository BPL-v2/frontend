import type { ItemLogbookModFaction } from "./itemLogbookModFaction";

export interface ItemLogbookMod {
  faction?: ItemLogbookModFaction;
  mods?: string[];
  name?: string;
}
