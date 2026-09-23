// Portions of this file are derived from pasteofexile (https://github.com/Dav1dde/pasteofexile)
// Licensed under GNU AGPL v3.0: https://www.gnu.org/licenses/agpl-3.0.html
// Copyright (c) Dav1dde and contributors

export interface PlayerStats {
  averageDamage: number;
  averageBurstDamage: number;
  speed: number;
  preEffectiveCritChance: number;
  critChance: number;
  critMultiplier: number;
  hitChance: number;
  totalDPS: number;
  totalDot: number;
  withBleedDPS: number;
  withIgniteDPS: number;
  poisonDPS: number;
  poisonDamage: number;
  withPoisonDPS: number;
  totalDotDPS: number;
  cullingDPS: number;
  reservationDPS: number;
  combinedDPS: number;
  areaOfEffectRadiusMetres: number;
  manaCost: number;
  manaPercentCost: number;
  manaPerSecondCost: number;
  manaPercentPerSecondCost: number;
  lifeCost: number;
  lifePercentCost: number;
  lifePerSecondCost: number;
  lifePercentPerSecondCost: number;
  esCost: number;
  esPerSecondCost: number;
  esPercentPerSecondCost: number;
  rageCost: number;
  soulCost: number;
  str: number;
  reqStr: number;
  dex: number;
  reqDex: number;
  int: number;
  reqInt: number;
  devotion: number;
  totalEHP: number;
  physicalMaximumHitTaken: number;
  lightningMaximumHitTaken: number;
  fireMaximumHitTaken: number;
  coldMaximumHitTaken: number;
  chaosMaximumHitTaken: number;
  mainHandAccuracy: number;
  life: number;
  specLifeInc: number;
  lifeUnreserved: number;
  lifeRecoverable: number;
  lifeUnreservedPercent: number;
  lifeRegenRecovery: number;
  lifeLeechGainRate: number;
  mana: number;
  specManaInc: number;
  manaUnreserved: number;
  manaUnreservedPercent: number;
  manaRegenRecovery: number;
  manaLeechGainRate: number;
  energyShield: number;
  energyShieldRecoveryCap: number;
  specEnergyShieldInc: number;
  energyShieldRegenRecovery: number;
  energyShieldLeechGainRate: number;
  ward: number;
  rageRegenRecovery: number;
  totalBuildDegen: number;
  totalNetRegen: number;
  netLifeRegen: number;
  netManaRegen: number;
  netEnergyShieldRegen: number;
  evasion: number;
  specEvasionInc: number;
  meleeEvadeChance: number;
  projectileEvadeChance: number;
  armour: number;
  specArmourInc: number;
  physicalDamageReduction: number;
  effectiveBlockChance: number;
  effectiveSpellBlockChance: number;
  attackDodgeChance: number;
  spellDodgeChance: number;
  effectiveSpellSuppressionChance: number;
  fireResist: number;
  fireResistOverCap: number;
  coldResist: number;
  coldResistOverCap: number;
  lightningResist: number;
  lightningResistOverCap: number;
  chaosResist: number;
  chaosResistOverCap: number;
  effectiveMovementSpeedMod: number;
  fullDPS: number;
  fullDotDPS: number;
  powerCharges: number;
  powerChargesMax: number;
  frenzyCharges: number;
  frenzyChargesMax: number;
  enduranceCharges: number;
  enduranceChargesMax: number;
}

export interface Gem {
  gemId: string;
  variantId: string;
  enableGlobal1: string;
  nameSpec: string;
  qualityId: string;
  enabled: string;
  enableGlobal2: string;
  quality: string;
  skillId: string;
  count: string;
  level: string;
  skillPart?: number;
  addedSinceLastSnapshot: boolean;
  levelChangedFromLastSnapshot: boolean;
  qualityChangedFromLastSnapshot: boolean;
}

export interface Skill {
  label: string;
  slot: string;
  mainActiveSkillCalcs: string;
  mainActiveSkill: string;
  includeInFullDPS: string;
  enabled: string;
  gems: Gem[];
}

export interface SkillSet {
  id: number;
  skills: Skill[];
}

export interface Skills {
  activeSkillSet: number;
  sortGemsByDPS: string;
  sortGemsByDPSField: string;
  showSupportGemTypes: string;
  showAltQualityGems: string;
  defaultGemLevel: string;
  defaultGemQuality: string;
  skillSets: SkillSet[];
}

export interface Build {
  playerStats: PlayerStats;
  bandit: string;
  level: number;
  mainSocketGroup: number;
  pantheonMajorGod: string;
  pantheonMinorGod: string;
  className: string;
  ascendClassName: string;
}

export interface Spec {
  masteryEffects: Record<number, number>;
  nodes: Set<number>;
  treeVersion: string;
  changesFromLastSnapshot?: {
    addedNodes: Set<number>;
    removedNodes: Set<number>;
  };
}

export interface PathOfBuilding {
  export: string;
  build: Build;
  skills: Skills;
  items: Item[];
  itemSets: ItemSetInfo[];
  spec: Spec;
}

export interface ItemSetInfo {
  id: string;
  title: string;
  isActive: boolean;
}

export enum Rarity {
  Relic,
  Unique,
  Rare,
  Magic,
  Normal,
}

enum Influence {
  Shaper,
  Elder,
  Crusader,
  Hunter,
  Redeemer,
  Warlord,
  SearingExarch,
  EaterOfWorlds,
  Synthesis,
  Fracture,
}

export interface Mod {
  fractured: boolean;
  crafted: boolean;
  mutated: boolean;
  line: string;
  changedFromLastSnapshot: boolean;
  tag?: string;
  variant?: string;
}

export interface Item {
  id: string;
  rarity: Rarity;
  name: string;
  base: string;
  itemLevel: number;
  levelRequirement: number;
  quality: number;
  altQuality?: string;
  armour: number;
  evasion: number;
  energyShield: number;
  influence1?: Influence;
  influence2?: Influence;
  mirrored: boolean;
  split: boolean;
  corrupted: boolean;
  selectedVariant: string;
  implicits: Mod[];
  enchants: Mod[];
  explicits: Mod[];
  mutatedMods: Mod[];
  slot: string | null;
  // Item sets (id from <ItemSet>) that place this item in a slot - lets
  // callers scope a search (e.g. "detect uniques") to item sets the user
  // picks, instead of only ever the currently active one.
  equippedInSetIds: string[];
  changedFromLastSnapshot: boolean;
  modsChangedFromLastSnapshot: boolean;
}

// True for jewels placed in a passive tree socket - decodePoBExport always
// gives these the literal slot name "Socket" (see the <Tree><Spec><Socket>
// loop below), which is a different, item-set-independent mechanism from
// the abyssal sockets embedded in gear (those show up as item-set slot
// names like "Weapon 1 Abyssal Socket 1" and are correctly scoped by
// equippedInSetIds already) - so this intentionally doesn't match "Abyssal"
// the way determineDifferences's broader slot-matching does.
export function isTreeSocketedSlot(slot: string | null): boolean {
  return slot === "Socket";
}

// PoB stat names (as found in the export XML) to PlayerStats fields.
const PLAYER_STAT_FIELDS: Record<string, keyof PlayerStats> = {
  AverageDamage: "averageDamage",
  AverageBurstDamage: "averageBurstDamage",
  Speed: "speed",
  PreEffectiveCritChance: "preEffectiveCritChance",
  CritChance: "critChance",
  CritMultiplier: "critMultiplier",
  HitChance: "hitChance",
  TotalDPS: "totalDPS",
  TotalDot: "totalDot",
  WithBleedDPS: "withBleedDPS",
  WithIgniteDPS: "withIgniteDPS",
  PoisonDPS: "poisonDPS",
  PoisonDamage: "poisonDamage",
  WithPoisonDPS: "withPoisonDPS",
  TotalDotDPS: "totalDotDPS",
  CullingDPS: "cullingDPS",
  ReservationDPS: "reservationDPS",
  CombinedDPS: "combinedDPS",
  AreaOfEffectRadiusMetres: "areaOfEffectRadiusMetres",
  ManaCost: "manaCost",
  ManaPercentCost: "manaPercentCost",
  ManaPerSecondCost: "manaPerSecondCost",
  ManaPercentPerSecondCost: "manaPercentPerSecondCost",
  LifeCost: "lifeCost",
  LifePercentCost: "lifePercentCost",
  LifePerSecondCost: "lifePerSecondCost",
  LifePercentPerSecondCost: "lifePercentPerSecondCost",
  ESCost: "esCost",
  ESPerSecondCost: "esPerSecondCost",
  ESPercentPerSecondCost: "esPercentPerSecondCost",
  RageCost: "rageCost",
  SoulCost: "soulCost",
  Str: "str",
  ReqStr: "reqStr",
  Dex: "dex",
  ReqDex: "reqDex",
  Int: "int",
  ReqInt: "reqInt",
  Devotion: "devotion",
  TotalEHP: "totalEHP",
  PhysicalMaximumHitTaken: "physicalMaximumHitTaken",
  LightningMaximumHitTaken: "lightningMaximumHitTaken",
  FireMaximumHitTaken: "fireMaximumHitTaken",
  ColdMaximumHitTaken: "coldMaximumHitTaken",
  ChaosMaximumHitTaken: "chaosMaximumHitTaken",
  MainHandAccuracy: "mainHandAccuracy",
  Life: "life",
  "Spec:LifeInc": "specLifeInc",
  LifeUnreserved: "lifeUnreserved",
  LifeRecoverable: "lifeRecoverable",
  LifeUnreservedPercent: "lifeUnreservedPercent",
  LifeRegenRecovery: "lifeRegenRecovery",
  LifeLeechGainRate: "lifeLeechGainRate",
  Mana: "mana",
  "Spec:ManaInc": "specManaInc",
  ManaUnreserved: "manaUnreserved",
  ManaUnreservedPercent: "manaUnreservedPercent",
  ManaRegenRecovery: "manaRegenRecovery",
  ManaLeechGainRate: "manaLeechGainRate",
  EnergyShield: "energyShield",
  EnergyShieldRecoveryCap: "energyShieldRecoveryCap",
  "Spec:EnergyShieldInc": "specEnergyShieldInc",
  EnergyShieldRegenRecovery: "energyShieldRegenRecovery",
  EnergyShieldLeechGainRate: "energyShieldLeechGainRate",
  Ward: "ward",
  RageRegenRecovery: "rageRegenRecovery",
  TotalBuildDegen: "totalBuildDegen",
  TotalNetRegen: "totalNetRegen",
  NetLifeRegen: "netLifeRegen",
  NetManaRegen: "netManaRegen",
  NetEnergyShieldRegen: "netEnergyShieldRegen",
  Evasion: "evasion",
  "Spec:EvasionInc": "specEvasionInc",
  MeleeEvadeChance: "meleeEvadeChance",
  ProjectileEvadeChance: "projectileEvadeChance",
  Armour: "armour",
  "Spec:ArmourInc": "specArmourInc",
  PhysicalDamageReduction: "physicalDamageReduction",
  EffectiveBlockChance: "effectiveBlockChance",
  EffectiveSpellBlockChance: "effectiveSpellBlockChance",
  AttackDodgeChance: "attackDodgeChance",
  SpellDodgeChance: "spellDodgeChance",
  EffectiveSpellSuppressionChance: "effectiveSpellSuppressionChance",
  FireResist: "fireResist",
  FireResistOverCap: "fireResistOverCap",
  ColdResist: "coldResist",
  ColdResistOverCap: "coldResistOverCap",
  LightningResist: "lightningResist",
  LightningResistOverCap: "lightningResistOverCap",
  ChaosResist: "chaosResist",
  ChaosResistOverCap: "chaosResistOverCap",
  EffectiveMovementSpeedMod: "effectiveMovementSpeedMod",
  FullDPS: "fullDPS",
  FullDotDPS: "fullDotDPS",
  PowerCharges: "powerCharges",
  PowerChargesMax: "powerChargesMax",
  FrenzyCharges: "frenzyCharges",
  FrenzyChargesMax: "frenzyChargesMax",
  EnduranceCharges: "enduranceCharges",
  EnduranceChargesMax: "enduranceChargesMax",
};

function setPlayerStat(stats: PlayerStats, stat: string, value: number): void {
  if (Object.hasOwn(PLAYER_STAT_FIELDS, stat)) {
    stats[PLAYER_STAT_FIELDS[stat]] = value;
  }
}

async function pobstringToXml(pob: string): Promise<Document> {
  const xmlString = await pobstringToXmlString(pob);
  // console.log(xmlString);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Failed to parse XML");
  }
  return xmlDoc;
}

async function pobstringToXmlString(pob: string): Promise<string> {
  const decoded = atob(pob.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("deflate"));
  const decompressed = await new Response(stream).arrayBuffer();
  return new TextDecoder().decode(decompressed);
}

const isJewelSlot = (slot: string) =>
  slot.includes("Abyssal") || slot.includes("Socket");

function markItemDifferences(pob1: PathOfBuilding, pob2: PathOfBuilding) {
  const pob1slot2items: Record<string, Item> = {};
  for (const item of pob1.items) {
    if (item.slot) pob1slot2items[item.slot] = item;
  }
  const jewels = pob1.items.filter(
    (item) => item.slot && isJewelSlot(item.slot),
  );
  for (const item of pob2.items) {
    if (!item.slot || !pob1slot2items[item.slot]) {
      item.changedFromLastSnapshot = true;
      continue;
    }
    let oldItem = pob1slot2items[item.slot];
    if (isJewelSlot(item.slot)) {
      // find matching jewel by id
      const matchingJewel = jewels.find((jewel) => jewel.name === item.name);
      if (!matchingJewel) {
        item.changedFromLastSnapshot = true;
        continue;
      }
      oldItem = matchingJewel;
    }
    determineModDifferences(oldItem.implicits, item.implicits);
    determineModDifferences(oldItem.enchants, item.enchants);
    determineModDifferences(oldItem.explicits, item.explicits);
    item.modsChangedFromLastSnapshot = [
      ...item.implicits,
      ...item.enchants,
      ...item.explicits,
    ].some((mod) => mod.changedFromLastSnapshot);
    if (oldItem.name !== item.name) {
      item.changedFromLastSnapshot = true;
    }
  }
}

function markGemDifferences(pob1: PathOfBuilding, pob2: PathOfBuilding) {
  const slot2gems: Record<string, Gem[]> = {};
  for (const skill of pob1.skills.skillSets.flatMap((set) => set.skills)) {
    (slot2gems[skill.slot] ??= []).push(...skill.gems);
  }
  for (const skill of pob2.skills.skillSets.flatMap((set) => set.skills)) {
    const oldGems = slot2gems[skill.slot];
    if (!oldGems) continue;
    for (const gem of skill.gems) {
      const matchingGem = oldGems.find(
        (g) => g.gemId === gem.gemId && g.variantId === gem.variantId,
      );
      if (!matchingGem) {
        gem.addedSinceLastSnapshot = true;
        gem.levelChangedFromLastSnapshot = true;
        continue;
      }
      if (matchingGem.level !== gem.level) {
        gem.levelChangedFromLastSnapshot = true;
      }
      if (matchingGem.quality !== gem.quality) {
        gem.qualityChangedFromLastSnapshot = true;
      }
    }
  }
}

export function determineDifferences(
  pob1: PathOfBuilding,
  pob2: PathOfBuilding,
) {
  pob2.spec.changesFromLastSnapshot = {
    addedNodes: pob2.spec.nodes.difference(pob1.spec.nodes),
    removedNodes: pob1.spec.nodes.difference(pob2.spec.nodes),
  };
  markItemDifferences(pob1, pob2);
  markGemDifferences(pob1, pob2);
}

function determineModDifferences(oldMods: Mod[], newMods: Mod[]): void {
  const oldModLines = oldMods.map((mod) => mod.line);
  for (const mod of newMods) {
    mod.changedFromLastSnapshot = !oldModLines.includes(mod.line);
  }
}

function attr(element: Element, name: string): string {
  return element.getAttribute(name) || "";
}

function parseMasteryEffects(value: string | null): Record<number, number> {
  return (
    value
      ?.slice(1, -1)
      .split("},{")
      .map((pair) => pair.split(",").map((num) => parseInt(num)))
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<number, number>,
      ) || {}
  );
}

function parseSpec(xmlDoc: Document): PathOfBuilding["spec"] {
  const spec = xmlDoc.getElementsByTagName("Spec")[0];
  return {
    masteryEffects: parseMasteryEffects(spec.getAttribute("masteryEffects")),
    nodes: new Set(
      spec
        .getAttribute("nodes")
        ?.split(",")
        .map((num) => parseInt(num)),
    ),
    treeVersion: attr(spec, "treeVersion").split("_").join("."),
  };
}

function parseBuild(xmlDoc: Document): Build {
  const build = xmlDoc.getElementsByTagName("Build")[0];
  const playerStats = {} as PlayerStats;
  for (const element of xmlDoc.getElementsByTagName("PlayerStat")) {
    const stat = element.getAttribute("stat");
    const value = element.getAttribute("value");
    if (stat && value) {
      setPlayerStat(playerStats, stat, parseFloat(value));
    }
  }
  return {
    playerStats,
    bandit: attr(build, "bandit"),
    level: parseInt(build.getAttribute("level") || "0"),
    mainSocketGroup: parseInt(build.getAttribute("mainSocketGroup") || "0"),
    pantheonMajorGod: attr(build, "pantheonMajorGod"),
    pantheonMinorGod: attr(build, "pantheonMinorGod"),
    className: attr(build, "className"),
    ascendClassName: attr(build, "ascendClassName"),
  };
}

function parseGem(element: Element): Gem {
  const gem: Gem = {
    gemId: attr(element, "gemId"),
    variantId: attr(element, "variantId"),
    enableGlobal1: attr(element, "enableGlobal1"),
    nameSpec: attr(element, "nameSpec"),
    qualityId: attr(element, "qualityId"),
    enabled: attr(element, "enabled"),
    enableGlobal2: attr(element, "enableGlobal2"),
    quality: attr(element, "quality"),
    skillId: attr(element, "skillId"),
    count: attr(element, "count"),
    level: attr(element, "level"),
    addedSinceLastSnapshot: false,
    levelChangedFromLastSnapshot: false,
    qualityChangedFromLastSnapshot: false,
  };
  const skillPart = element.getAttribute("skillPart");
  if (skillPart) {
    gem.skillPart = parseInt(skillPart);
  }
  return gem;
}

function parseSkill(element: Element): Skill {
  return {
    label: attr(element, "label"),
    slot: attr(element, "slot"),
    mainActiveSkillCalcs: attr(element, "mainActiveSkillCalcs"),
    mainActiveSkill: attr(element, "mainActiveSkill"),
    includeInFullDPS: attr(element, "includeInFullDPS"),
    enabled: attr(element, "enabled"),
    gems: Array.from(element.getElementsByTagName("Gem"), parseGem),
  };
}

function parseSkills(xmlDoc: Document, defaults: Skills): Skills {
  const element = xmlDoc.getElementsByTagName("Skills")[0];
  if (!element) {
    return defaults;
  }
  return {
    activeSkillSet: parseInt(element.getAttribute("activeSkillSet") || "0"),
    sortGemsByDPS: attr(element, "sortGemsByDPS"),
    sortGemsByDPSField: attr(element, "sortGemsByDPSField"),
    showSupportGemTypes: attr(element, "showSupportGemTypes"),
    showAltQualityGems: attr(element, "showAltQualityGems"),
    defaultGemLevel: attr(element, "defaultGemLevel"),
    defaultGemQuality: attr(element, "defaultGemQuality"),
    skillSets: Array.from(
      element.getElementsByTagName("SkillSet"),
      (skillSet): SkillSet => ({
        id: parseInt(skillSet.getAttribute("id") || "0"),
        skills: Array.from(skillSet.getElementsByTagName("Skill"), parseSkill),
      }),
    ),
  };
}

/** Item ids that are socketed into the passive tree of the active spec. */
function findTreeSocketedItems(xmlDoc: Document): Record<string, string> {
  const idToSlot: Record<string, string> = {};
  const tree = xmlDoc.getElementsByTagName("Tree")[0];
  if (tree) {
    const specs = tree.getElementsByTagName("Spec");
    const activeSpec = Number(tree.getAttribute("activeSpec"));
    for (const socket of specs[activeSpec - 1].getElementsByTagName("Socket")) {
      idToSlot[attr(socket, "itemId")] = "Socket";
    }
  }
  return idToSlot;
}

/**
 * Reads the item sets and returns which slot each item occupies in the
 * active set, plus every set an item is equipped in - so callers (e.g. a
 * "which item sets should we scan?" picker) can scope a search to specific
 * sets instead of only ever the currently active one.
 */
function parseItemSets(itemsElement: Element): {
  itemSets: ItemSetInfo[];
  idToSlot: Record<string, string | null>;
  itemIdToSetIds: Record<string, string[]>;
} {
  const itemSets: ItemSetInfo[] = [];
  const idToSlot: Record<string, string | null> = {};
  const itemIdToSetIds: Record<string, string[]> = {};
  const setElements = itemsElement.getElementsByTagName("ItemSet");
  // A build can have several item sets (e.g. a "before/after upgrade"
  // comparison) - use whichever one is actually active instead of
  // always the first, or slots from an unequipped set get picked up.
  const activeItemSet = Number(itemsElement.getAttribute("activeItemSet"));
  const activeIndex = setElements[activeItemSet - 1] ? activeItemSet - 1 : 0;
  for (let i = 0; i < setElements.length; i++) {
    const setElement = setElements[i];
    const setId = setElement.getAttribute("id") || String(i + 1);
    itemSets.push({
      id: setId,
      title: setElement.getAttribute("title") || "Default",
      isActive: i === activeIndex,
    });
    for (const slot of setElement.getElementsByTagName("Slot")) {
      const itemId = attr(slot, "itemId");
      if (!itemId || itemId === "0") continue;
      (itemIdToSetIds[itemId] ??= []).push(setId);
      if (i === activeIndex) {
        idToSlot[itemId] = slot.getAttribute("name");
      }
    }
  }
  return { itemSets, idToSlot, itemIdToSetIds };
}

function parseItems(
  xmlDoc: Document,
  itemsElement: Element,
  baseTypes?: string[],
): { items: Item[]; itemSets: ItemSetInfo[] } {
  const { itemSets, idToSlot, itemIdToSetIds } = parseItemSets(itemsElement);
  const slots: Record<string, string | null> = {
    ...findTreeSocketedItems(xmlDoc),
    ...idToSlot,
  };
  const items = Array.from(itemsElement.getElementsByTagName("Item"), (el) => {
    let text = "";
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || "";
      }
    }
    const itemId = el.getAttribute("id")!;
    const item = parseItem(text.trim(), slots[itemId], itemId, baseTypes);
    item.equippedInSetIds = itemIdToSetIds[itemId] || [];
    return item;
  });
  return { items, itemSets };
}

export async function decodePoBExport(
  input?: string,
  baseTypes?: string[],
): Promise<PathOfBuilding> {
  const result: PathOfBuilding = {
    export: input || "",
    build: {
      playerStats: {} as PlayerStats,
      bandit: "",
      level: 0,
      mainSocketGroup: 0,
      pantheonMajorGod: "",
      pantheonMinorGod: "",
      className: "",
      ascendClassName: "",
    },
    skills: {
      activeSkillSet: 0,
      sortGemsByDPS: "",
      sortGemsByDPSField: "",
      showSupportGemTypes: "",
      showAltQualityGems: "",
      defaultGemLevel: "",
      defaultGemQuality: "",
      skillSets: [],
    },
    spec: {
      masteryEffects: {},
      nodes: new Set(),
      treeVersion: "",
    },
    items: [],
    itemSets: [],
  };
  if (!input || input.length === 0) {
    return result;
  }
  const xmlDoc = await pobstringToXml(input);
  result.spec = parseSpec(xmlDoc);
  result.build = parseBuild(xmlDoc);
  result.skills = parseSkills(xmlDoc, result.skills);
  const itemsElement = xmlDoc.getElementsByTagName("Items")[0];
  if (itemsElement) {
    Object.assign(result, parseItems(xmlDoc, itemsElement, baseTypes));
  }
  return result;
}

function parseRarity(s: string): Rarity {
  switch (s) {
    case "NORMAL":
      return Rarity.Normal;
    case "MAGIC":
      return Rarity.Magic;
    case "RARE":
      return Rarity.Rare;
    case "UNIQUE":
      return Rarity.Unique;
    case "RELIC":
      return Rarity.Unique;
    default:
      throw new Error(`invalid rarity: ${s}`);
  }
}

function parseInfluence(s: string): Influence | undefined {
  switch (s) {
    case "Shaper Item":
      return Influence.Shaper;
    case "Elder Item":
      return Influence.Elder;
    case "Crusader Item":
      return Influence.Crusader;
    case "Hunter Item":
      return Influence.Hunter;
    case "Redeemer Item":
      return Influence.Redeemer;
    case "Warlord Item":
      return Influence.Warlord;
    case "Searing Exarch Item":
      return Influence.SearingExarch;
    case "Eater of Worlds Item":
      return Influence.EaterOfWorlds;
    default:
      if (s.startsWith("Synthesised")) return Influence.Synthesis;
      return undefined;
  }
}

const CATALYST_ALT_QUALITY: Record<string, string> = {
  Abrasive: "Attack Modifiers",
  Accelerating: "Speed Modifiers",
  Fertile: "Life and Mana Modifiers",
  Imbued: "Caster Modifiers",
  Intrinsic: "Attribute Modifiers",
  Noxious: "Physical and Chaos Damage Modifiers",
  Prismatic: "Resistance Modifiers",
  Tempering: "Defense Modifiers",
  Turbulent: "Elemental Modifiers",
  Unstable: "Critical Modifiers",
};

function catalystToAltQuality(s: string): string {
  return Object.hasOwn(CATALYST_ALT_QUALITY, s) ? CATALYST_ALT_QUALITY[s] : s;
}

function fixupItemName(name: string): string {
  const idx = name.lastIndexOf("- ");
  if (idx !== -1) name = name.slice(idx + 2);
  const bracket = name.indexOf("[");
  if (bracket !== -1) name = name.slice(0, bracket);
  return name.replace("Superior", "").trim();
}

function parseAltQuality(
  cmd: string,
  arg: string,
): { alt: string; quality: number } | undefined {
  if (!cmd.startsWith("Quality (") || !cmd.endsWith(")")) return undefined;
  const alt = cmd.slice("Quality (".length, -1);
  const val = arg.replace(/^\+/, "").replace(/%$/, "");
  const quality = parseInt(val, 10);
  if (isNaN(quality)) return undefined;
  return { alt, quality };
}

function isModLine(line: string): boolean {
  const fields = line.trim().split(/\s+/);
  return fields.length > 0 && !fields[0].endsWith(":");
}

function parseMod(modLine: string): Mod {
  let fractured = false,
    crafted = false,
    mutated = false,
    variant: string | undefined,
    tag: string | undefined;
  let line = modLine;
  while (line.startsWith("{")) {
    const end = line.indexOf("}");
    if (end === -1) break;
    const attr = line.slice(1, end);
    line = line.slice(end + 1);
    const [key, value] = attr.split(":", 2);
    if (value !== undefined) {
      switch (key) {
        case "variant":
          variant = value;
          break;
        case "fractured":
          fractured = true;
          break;
        case "crafted":
          crafted = true;
          break;
        case "mutated":
          mutated = true;
          break;
        case "tags":
        case "custom":
        case "range":
          break;
        default:
          tag = key;
          break;
      }
    } else {
      switch (key) {
        case "fractured":
          fractured = true;
          break;
        case "crafted":
          crafted = true;
          break;
        case "mutated":
          mutated = true;
          break;
        default:
          tag = key;
          break;
      }
    }
  }
  return {
    fractured,
    crafted,
    mutated,
    line: line.trim(),
    changedFromLastSnapshot: false,
    tag,
    variant,
  };
}

function extractMagicBase(
  base: string,
  numMods: number,
  baseTypes?: string[],
): string {
  if (base.startsWith("Synthesised ")) base = base.split("Synthesised ")[1];
  if (numMods === 0) return base;
  let end = base.indexOf(" of");
  const hasSuffix = end !== -1;
  if (!hasSuffix) end = base.length;
  base = base.slice(0, end).trim();
  for (const baseType of baseTypes || []) {
    if (base.includes(baseType)) {
      return baseType;
    }
  }
  return base;
}

type ItemProperties = {
  itemLevel: number;
  levelRequirement: number;
  quality: number;
  altQuality: string | undefined;
  armour: number;
  evasion: number;
  energyShield: number;
  influence1: Influence | undefined;
  influence2: Influence | undefined;
  selectedVariant: string;
  implicits: Mod[];
  enchants: Mod[];
  id: string;
};

const NUMERIC_ITEM_PROPERTIES: Record<
  string,
  | "itemLevel"
  | "levelRequirement"
  | "quality"
  | "armour"
  | "evasion"
  | "energyShield"
> = {
  "Item Level": "itemLevel",
  LevelReq: "levelRequirement",
  Quality: "quality",
  CatalystQuality: "quality",
  Armour: "armour",
  Evasion: "evasion",
  "Energy Shield": "energyShield",
};

/** Applies one "Command: argument" line; returns extra lines consumed. */
function applyItemProperty(
  props: ItemProperties,
  lines: string[],
  idx: number,
  cmd: string,
  arg: string,
): number {
  if (Object.hasOwn(NUMERIC_ITEM_PROPERTIES, cmd)) {
    const key = NUMERIC_ITEM_PROPERTIES[cmd];
    props[key] = parseInt(arg) || props[key];
    return 0;
  }
  switch (cmd) {
    case "Catalyst":
      props.altQuality = catalystToAltQuality(arg);
      break;
    case "Implicits": {
      const num = parseInt(arg) || 0;
      for (let i = 0; i < num; i++) {
        const line = lines[idx + 1 + i];
        (line.startsWith("{crafted}") ? props.enchants : props.implicits).push(
          parseMod(line),
        );
      }
      return num;
    }
    case "Selected Variant":
      props.selectedVariant = arg;
      break;
    case "Unique ID":
      props.id = arg;
      break;
    default: {
      const altQ = parseAltQuality(cmd, arg);
      if (altQ) {
        props.altQuality = altQ.alt;
        props.quality = altQ.quality;
      }
    }
  }
  return 0;
}

/** Parses the property block after the item name; returns the index of the first unparsed line. */
function parseItemProperties(
  lines: string[],
  startIdx: number,
  base: string,
  id: string,
): { props: ItemProperties; idx: number } {
  const props: ItemProperties = {
    itemLevel: 0,
    levelRequirement: 0,
    quality: 0,
    altQuality: undefined,
    armour: 0,
    evasion: 0,
    energyShield: 0,
    influence1: undefined,
    influence2: undefined,
    selectedVariant: "",
    implicits: [],
    enchants: [],
    id,
  };
  let idx = startIdx;
  while (idx < lines.length) {
    const line = lines[idx];
    if (!line) {
      idx++;
      continue;
    }
    const colon = line.indexOf(": ");
    if (colon !== -1) {
      idx += applyItemProperty(
        props,
        lines,
        idx,
        line.slice(0, colon),
        line.slice(colon + 2),
      );
      idx++;
      continue;
    }
    const infl = parseInfluence(line);
    if (infl !== undefined) {
      if (props.influence1 === undefined) props.influence1 = infl;
      else if (props.influence2 === undefined) props.influence2 = infl;
      idx++;
      continue;
    }
    if (line === base) {
      idx++;
      continue;
    }
    break;
  }
  return { props, idx };
}

/** Reads trailing "Corrupted"/"Mirrored"/"Split" lines. */
function parseItemStatusLines(lines: string[]) {
  const status = { corrupted: false, mirrored: false, split: false };
  let modsEnd = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i] === "Corrupted") status.corrupted = true;
    else if (lines[i] === "Mirrored") status.mirrored = true;
    else if (lines[i] === "Split") status.split = true;
    else {
      modsEnd = i + 1;
      break;
    }
  }
  return { ...status, modsEnd };
}

function parseExplicitMods(lines: string[], start: number, end: number) {
  const explicits: Mod[] = [];
  const mutatedMods: Mod[] = [];
  let first = -1;
  for (let i = start; i < end; i++) {
    if (isModLine(lines[i])) {
      first = i;
      break;
    }
  }
  if (first !== -1) {
    for (let i = first; i < end; i++) {
      const mod = parseMod(lines[i]);
      (mod.mutated ? mutatedMods : explicits).push(mod);
    }
  }
  return { explicits, mutatedMods };
}

function parseItem(
  item: string,
  slot: string | null,
  id: string,
  baseTypeDimensions?: string[],
): Item {
  const lines = item.split("\n");
  if (!lines[0].startsWith("Rarity: ")) throw new Error("expected rarity");
  const rarity = parseRarity(lines[0].slice(8));
  let idx = 1;
  let name = "",
    base = "";
  if ([Rarity.Rare, Rarity.Unique, Rarity.Relic].includes(rarity)) {
    name = lines[idx++] || "";
  }
  base = lines[idx++] || "";
  if ([Rarity.Normal, Rarity.Magic].includes(rarity)) name = base;
  base = fixupItemName(base);

  const parsed = parseItemProperties(lines, idx, base, id);
  const { props } = parsed;
  const { corrupted, mirrored, split, modsEnd } = parseItemStatusLines(lines);
  const { explicits, mutatedMods } = parseExplicitMods(
    lines,
    parsed.idx,
    modsEnd,
  );

  if (rarity === Rarity.Magic) {
    base = extractMagicBase(base, explicits.length, baseTypeDimensions);
  }

  // Fractured influence
  let { influence1, influence2 } = props;
  if (
    influence1 === undefined &&
    explicits.some((mod) => mod.tag === "fractured")
  ) {
    influence1 = Influence.Fracture;
  }
  if (influence2 === undefined && influence1 !== undefined) {
    influence2 = influence1;
  }

  return {
    rarity,
    name,
    base,
    itemLevel: props.itemLevel,
    levelRequirement: props.levelRequirement,
    quality: props.quality,
    altQuality: props.altQuality,
    armour: props.armour,
    evasion: props.evasion,
    energyShield: props.energyShield,
    influence1,
    influence2,
    mirrored,
    split,
    corrupted,
    selectedVariant: props.selectedVariant,
    implicits: props.implicits,
    explicits,
    enchants: props.enchants,
    mutatedMods,
    slot,
    equippedInSetIds: [],
    id: props.id,
    changedFromLastSnapshot: false,
    modsChangedFromLastSnapshot: false,
  };
}
