import type { Faction } from "./faction.ts";

export interface ItemLogbookMod {
  faction: Faction;
  /** Name area name */
  name: string;
}
