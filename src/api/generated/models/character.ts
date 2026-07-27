import type { CharacterMetadata } from "./characterMetadata.ts";
import type { CharacterPassives } from "./characterPassives.ts";
import type { Item } from "./item.ts";
import type { Realm } from "./realm.ts";

export interface Character {
  class: string;
  /** Current always true if present */
  current?: boolean;
  /** Deleted always true if present */
  deleted?: boolean;
  equipment?: Item[];
  experience: number;
  /** Expired always true if present */
  expired?: boolean;
  /** Guardian PoE1 only */
  guardian?: Item[];
  /** Id a unique 64 digit hexadecimal string */
  id: string;
  /** Inventory PoE1 only */
  inventory?: Item[];
  jewels?: Item[];
  league?: string;
  level: number;
  metadata?: CharacterMetadata;
  name: string;
  passives?: CharacterPassives;
  realm: Realm;
  /** Rucksack PoE1 only */
  rucksack?: Item[];
  /** Ruthless PoE1 only; always true if present */
  ruthless?: boolean;
  /** Skills PoE2 only */
  skills?: Item[];
}
