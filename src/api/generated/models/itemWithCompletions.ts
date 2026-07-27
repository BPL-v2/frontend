import type { GemTab } from "./gemTab.ts";
import type { Item } from "./item.ts";
import type { ItemColour } from "./itemColour.ts";
import type { ItemCrucible } from "./itemCrucible.ts";
import type { ItemEnshrouded } from "./itemEnshrouded.ts";
import type { ItemExtended } from "./itemExtended.ts";
import type { ItemHybrid } from "./itemHybrid.ts";
import type { ItemIncubatedItem } from "./itemIncubatedItem.ts";
import type { ItemLogbookMod } from "./itemLogbookMod.ts";
import type { ItemMercenarySkill } from "./itemMercenarySkill.ts";
import type { ItemMod } from "./itemMod.ts";
import type { ItemProperty } from "./itemProperty.ts";
import type { ItemRarity } from "./itemRarity.ts";
import type { ItemReward } from "./itemReward.ts";
import type { ItemScourged } from "./itemScourged.ts";
import type { ItemSocket } from "./itemSocket.ts";
import type { ItemUltimatumMod } from "./itemUltimatumMod.ts";
import type { ItemWithCompletionsInfluences } from "./itemWithCompletionsInfluences.ts";
import type { Realm } from "./realm.ts";

export interface ItemWithCompletions {
  /** AbyssJewel always true if present */
  abyssJewel?: boolean;
  additionalProperties?: ItemProperty[];
  artFilename?: string;
  baseType: string;
  /** BondedMods PoE2 only */
  bondedMods?: string[];
  /** BuiltInSupport PoE1 only; Supported by level 1 x */
  builtInSupport?: string;
  /** CisRaceReward always true if present */
  cisRaceReward?: boolean;
  colour?: ItemColour;
  /** Corrupted always true if present */
  corrupted?: boolean;
  cosmeticMods?: string[];
  crucible?: ItemCrucible;
  /** CrucibleMods only allocated mods are included */
  crucibleMods?: string[];
  /** Delve always true if present */
  delve?: boolean;
  descrText?: string;
  /** Desecrated PoE2 only; always true if present */
  desecrated?: boolean;
  /** DoubleCorrupted PoE2 only; always true if present */
  doubleCorrupted?: boolean;
  /** Duplicated always true if present */
  duplicated?: boolean;
  /** Elder always true if present */
  elder?: boolean;
  enchantMods?: string[];
  enshrouded?: ItemEnshrouded;
  explicitMods?: ItemMod[];
  extended?: ItemExtended;
  flavourText?: string[];
  /** FlavourTextNote user-generated text */
  flavourTextNote?: string;
  foilVariation?: number;
  /** Foreseeing always true if present */
  foreseeing?: boolean;
  /** ForumNote user-generated text */
  forum_note?: string;
  /** Fractured always true if present */
  fractured?: boolean;
  /** FrameType deprecated; use frameTypeId */
  frameType?: number;
  frameTypeId: string;
  /** GemBackground PoE2 only */
  gemBackground?: string;
  /** GemSkill PoE2 only */
  gemSkill?: string;
  /** GemSockets PoE2 only; string is always W */
  gemSockets?: string[];
  /** GemTabs PoE2 only */
  gemTabs?: GemTab[];
  /** GrantedSkills PoE2 only */
  grantedSkills?: ItemProperty[];
  h: number;
  hybrid?: ItemHybrid;
  icon: string;
  /** IconStackLevel describes the level of a stack of items */
  iconStackLevel?: string;
  /** IconTierText usually roman numerals */
  iconTierText?: string;
  /** Id a unique 64 digit hexadecimal string */
  id?: string;
  identified: boolean;
  ilvl: number;
  implicitMods?: ItemMod[];
  incubatedItem?: ItemIncubatedItem;
  influences?: ItemWithCompletionsInfluences;
  inventoryId?: string;
  /** IsRelic always true if present */
  isRelic?: boolean;
  /** ItemLevel used for items that always display their item level */
  itemLevel?: number;
  league?: string;
  /** LockedToAccount always true if present */
  lockedToAccount?: boolean;
  /** LockedToCharacter always true if present */
  lockedToCharacter?: boolean;
  logbookMods?: ItemLogbookMod[];
  maxStackSize?: number;
  /** MemoryItem always true if present */
  memoryItem?: boolean;
  mercenarySkills?: ItemMercenarySkill[];
  /** MonsterLevel PoE1 only; used for items that always display their monster level */
  monsterLevel?: number;
  /** Mutated PoE1: true on Foulborn Uniques, PoE2: true on all Vaal Uniques */
  mutated?: boolean;
  name: string;
  nextLevelRequirements?: ItemProperty[];
  notableProperties?: ItemProperty[];
  /** Note user-generated text */
  note?: string;
  objective_id?: number;
  properties?: ItemProperty[];
  prophecyText?: string;
  rarity?: ItemRarity;
  realm?: Realm;
  /** Replica always true if present */
  replica?: boolean;
  requirements?: ItemProperty[];
  rewards?: ItemReward[];
  /** RuneMods PoE2 only */
  runeMods?: string[];
  /** Ruthless always true if present */
  ruthless?: boolean;
  /** Sanctified PoE2 only; always true if present */
  sanctified?: boolean;
  scourgeMods?: string[];
  scourged?: ItemScourged;
  /** SeaRaceReward always true if present */
  seaRaceReward?: boolean;
  /** Searing always true if present */
  searing?: boolean;
  secDescrText?: string;
  /** Shaper always true if present */
  shaper?: boolean;
  socket?: number;
  /** SocketedIcon PoE2 only; an image URL to use when this item is in the socket of another item */
  socketedIcon?: string;
  socketedItems?: Item[];
  sockets?: ItemSocket[];
  /** Split always true if present */
  split?: boolean;
  stackSize?: number;
  stackSizeText?: string;
  /** Support always true if present */
  support?: boolean;
  /** SupportGemRequirements PoE2 only */
  supportGemRequirements?: ItemProperty[];
  /** Synthesised always true if present */
  synthesised?: boolean;
  /** TamedBeastProperties PoE2 only */
  tamedBeastProperties?: ItemProperty[];
  /** Tangled always true if present */
  tangled?: boolean;
  /** ThRaceReward always true if present */
  thRaceReward?: boolean;
  typeLine: string;
  ultimatumMods?: ItemUltimatumMod[];
  /** UnidentifiedTier PoE2 only */
  unidentifiedTier?: number;
  /** Unmodifiable always true if present */
  unmodifiable?: boolean;
  /** UnmodifiableExceptChaos always true if present */
  unmodifiableExceptChaos?: boolean;
  utilityMods?: string[];
  /** Veiled always true if present */
  veiled?: boolean;
  /** VeiledMods random video identifier */
  veiledMods?: string[];
  verified: boolean;
  /** Vestigial PoE1 only; always true if present */
  vestigial?: boolean;
  w: number;
  /** WeaponRequirements PoE2 only */
  weaponRequirements?: ItemProperty[];
  x?: number;
  y?: number;
}
