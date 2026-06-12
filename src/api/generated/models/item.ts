import type { GemSocket } from "./gemSocket.ts";
import type { ItemExtended } from "./itemExtended.ts";
import type { ItemHybrid } from "./itemHybrid.ts";
import type { ItemIncubatedItem } from "./itemIncubatedItem.ts";
import type { ItemInfluences } from "./itemInfluences.ts";
import type { ItemLogbookMod } from "./itemLogbookMod.ts";
import type { ItemProperty } from "./itemProperty.ts";
import type { ItemReward } from "./itemReward.ts";
import type { ItemSocket } from "./itemSocket.ts";
import type { ItemUltimatumMod } from "./itemUltimatumMod.ts";

export interface Item {
  abyssJewel?: boolean;
  additionalProperties?: ItemProperty[];
  baseType?: string;
  /** PoE2 only */
  bondedMods?: string[];
  colour?: string;
  corrupted?: boolean;
  cosmeticMods?: string[];
  craftedMods?: string[];
  delve?: boolean;
  /** PoE2 only */
  desecrated?: boolean;
  /** PoE2 only */
  desecratedMods?: string[];
  /** PoE2 only */
  doubleCorrupted?: boolean;
  duplicated?: boolean;
  elder?: boolean;
  enchantMods?: string[];
  explicitMods?: string[];
  extended?: ItemExtended;
  foilVariation?: number;
  foreseeing?: boolean;
  fractured?: boolean;
  fracturedMods?: string[];
  frameTypeId?: string;
  gemSockets?: GemSocket[];
  /** PoE2 only */
  grantedSkills?: ItemProperty[];
  h?: number;
  hybrid?: ItemHybrid;
  icon?: string;
  id?: string;
  identified?: boolean;
  ilvl?: number;
  implicitMods?: string[];
  incubatedItem?: ItemIncubatedItem;
  influences?: ItemInfluences;
  inventoryId?: string;
  isRelic?: boolean;
  itemLevel?: number;
  logbookMods?: ItemLogbookMod[];
  memoryItem?: boolean;
  mutated?: boolean;
  mutatedMods?: string[];
  name?: string;
  notableProperties?: ItemProperty[];
  /** filled by us and not ggg */
  objectiveId?: number;
  properties?: ItemProperty[];
  rarity?: string;
  rewards?: ItemReward[];
  /** PoE2 only */
  runeMods?: string[];
  ruthless?: boolean;
  scourgeMods?: string[];
  searing?: boolean;
  shaper?: boolean;
  socket?: number;
  socketedItems?: Item[];
  sockets?: ItemSocket[];
  split?: boolean;
  stackSize?: number;
  support?: boolean;
  /** PoE2 only */
  supportGemRequirements?: ItemProperty[];
  synthesised?: boolean;
  talismanTier?: number;
  tangled?: boolean;
  typeLine?: string;
  ultimatumMods?: ItemUltimatumMod[];
  unmodifiable?: boolean;
  utilityMods?: string[];
  veiled?: boolean;
  veiledMods?: string[];
  w?: number;
  /** PoE2 only */
  weaponRequirements?: ItemProperty[];
  x?: number;
  y?: number;
}
