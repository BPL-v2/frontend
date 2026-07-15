import type { GemSocket } from "./gemSocket.ts";
import type { GemTab } from "./gemTab.ts";
import type { ItemExtended } from "./itemExtended.ts";
import type { ItemHybrid } from "./itemHybrid.ts";
import type { ItemIncubatedItem } from "./itemIncubatedItem.ts";
import type { ItemInfluences } from "./itemInfluences.ts";
import type { ItemLogbookMod } from "./itemLogbookMod.ts";
import type { ItemProperty } from "./itemProperty.ts";
import type { ItemReward } from "./itemReward.ts";
import type { ItemScourged } from "./itemScourged.ts";
import type { ItemSocket } from "./itemSocket.ts";
import type { ItemUltimatumMod } from "./itemUltimatumMod.ts";
import type { Realm } from "./realm.ts";

export interface Item {
  abyssJewel?: boolean;
  additionalProperties?: ItemProperty[];
  artFilename?: string;
  baseType?: string;
  /** PoE2 only */
  bondedMods?: string[];
  /** PoE1 only; Supported by level 1 x */
  builtInSupport?: string;
  cisRaceReward?: boolean;
  colour?: string;
  corrupted?: boolean;
  cosmeticMods?: string[];
  craftedMods?: string[];
  delve?: boolean;
  descrText?: string;
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
  flavourText?: string[];
  flavourTextNote?: string;
  flavourTextParsed?: unknown[];
  foilVariation?: number;
  foreseeing?: boolean;
  forum_note?: string;
  fractured?: boolean;
  fracturedMods?: string[];
  frameType?: number;
  frameTypeId?: string;
  /** PoE2 only */
  gemBackground?: string;
  /** PoE2 only */
  gemSkill?: string;
  gemSockets?: GemSocket[];
  /** PoE2 only */
  gemTabs?: GemTab[];
  /** PoE2 only */
  grantedSkills?: ItemProperty[];
  h?: number;
  hybrid?: ItemHybrid;
  icon?: string;
  /** usually roman numerals */
  iconTierText?: string;
  id?: string;
  identified?: boolean;
  ilvl?: number;
  implicitMods?: string[];
  incubatedItem?: ItemIncubatedItem;
  influences?: ItemInfluences;
  inventoryId?: string;
  isRelic?: boolean;
  itemLevel?: number;
  league?: string;
  lockedToAccount?: boolean;
  lockedToCharacter?: boolean;
  logbookMods?: ItemLogbookMod[];
  maxStackSize?: number;
  memoryItem?: boolean;
  /** PoE1 only; used for items that always display their monster level */
  monsterLevel?: number;
  mutated?: boolean;
  mutatedMods?: string[];
  name?: string;
  nextLevelRequirements?: ItemProperty[];
  notableProperties?: ItemProperty[];
  note?: string;
  /** filled by us and not ggg */
  objectiveId?: number;
  properties?: ItemProperty[];
  prophecyText?: string;
  rarity?: string;
  realm?: Realm;
  replica?: boolean;
  requirements?: ItemProperty[];
  rewards?: ItemReward[];
  /** PoE2 only */
  runeMods?: string[];
  ruthless?: boolean;
  /** PoE2 only */
  sanctified?: boolean;
  scourgeMods?: string[];
  scourged?: ItemScourged;
  seaRaceReward?: boolean;
  searing?: boolean;
  secDescrText?: string;
  shaper?: boolean;
  socket?: number;
  /** PoE2 only */
  socketedIcon?: string;
  socketedItems?: Item[];
  sockets?: ItemSocket[];
  split?: boolean;
  stackSize?: number;
  stackSizeText?: string;
  support?: boolean;
  /** PoE2 only */
  supportGemRequirements?: ItemProperty[];
  synthesised?: boolean;
  talismanTier?: number;
  /** PoE2 only */
  tamedBeastProperties?: ItemProperty[];
  tangled?: boolean;
  thRaceReward?: boolean;
  typeLine?: string;
  ultimatumMods?: ItemUltimatumMod[];
  /** PoE2 only */
  unidentifiedTier?: number;
  unmodifiable?: boolean;
  utilityMods?: string[];
  veiled?: boolean;
  veiledMods?: string[];
  verified?: boolean;
  w?: number;
  /** PoE2 only */
  weaponRequirements?: ItemProperty[];
  x?: number;
  y?: number;
}
