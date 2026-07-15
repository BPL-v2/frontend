import type { Item } from "./item.ts";
import type { Metadata } from "./metadata.ts";
import type { Passives } from "./passives.ts";
import type { Realm } from "./realm.ts";

export interface GGGCharacter {
  class?: string;
  current?: boolean;
  deleted?: boolean;
  equipment?: Item[];
  experience?: number;
  expired?: boolean;
  id?: string;
  inventory?: Item[];
  jewels?: Item[];
  league?: string;
  level?: number;
  metadata?: Metadata;
  name?: string;
  passives?: Passives;
  realm?: Realm;
  rucksack?: Item[];
  ruthless?: boolean;
  /** PoE2 only */
  skills?: Item[];
}
