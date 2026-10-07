import {
  Objective,
  GameVersion,
  Operator,
  ItemField,
  Condition,
} from "@api/generated/models";
import type { ScoreObjective } from "./score";

const anomalousUniques: {
  [gameVersion: string]: Record<string, Record<string, string>>;
} = {
  poe1: {
    "Grand Spectrum": {
      "Elemental Resistances": "RedGrandSpectrum",
      "Minimum Endurance Charges": "GrandSpectrum3_Red",
      "Minimum Frenzy Charges": "GrandSpectrum3_Green",
      "Minimum Power Charges": "GrandSpectrum3_Blue",
      Life: "GrandSpectrum2_red",
      "Critical Strike Chance": "BlueGrandSpectrum",
      "Minion Critical Strike Multiplier": "GrandSpectrum2_blue",
      "Elemental Damage": "GreenGrandSpectrum",
      "Avoid Elemental Ailments": "GrandSpectrum2_Green",
    },
    Impresence: {
      Cold: "ElderCold",
      Fire: "ElderFire",
      Lightning: "ElderLightning",
      Chaos: "ElderChaos",
      Physical: "ElderPhysical",
    },
    "Doryani's Delusion": {
      "Titan Greaves": "DoriyanisRed",
      "Sorcerer Boots": "DoriyanisBlue",
      "Slink Boots": "DoriyanisGreen",
    },
    "Precursor's Emblem": {
      Strength: "CombinedRedRing",
      Dexterity: "CombinedGreenRing",
      Intelligence: "CombinedBlueRing",
      "Strength and Intelligence": "CombinedRedBlueRing",
      "Strength and Dexterity": "CombinedRedGreenRing",
      "Dexterity and Intelligence": "CombinedGreenBlueRing",
      "All Attributes": "CombinedPrismaticRing",
    },
    "Combat Focus": {
      "Cobalt Jewel": "ElementalHitFire",
      "Viridian Jewel": "ElementalHitLightening",
      "Crimson Jewel": "ElementalHitCold",
    },
    "The Beachhead": {
      T5: "HarbingerWhite",
      T10: "HarbingerYellow",
      T15: "HarbingerRed",
    },
  },
  poe2: {
    "Grand Spectrum": {
      Ruby: "GrandSpectrum_Ruby",
      Emerald: "GrandSpectrum_Emerald",
      Sapphire: "GrandSpectrum_Sapphire",
    },
    "Sekhema's Resolve": {
      Cold: "RimeveilSeal",
      Fire: "EmberheartSeal",
      Lightning: "StormforgedSeal",
    },
  },
};
const beasts = [
  "Farric Flame Hellion Alpha",
  "Farric Frost Hellion Alpha",
  "Wild Hellion Alpha",
  "Flame Hellion",
  "Dune Hellion",
  "Ruins Hellion",
  "Mountain Hellion",
  "Mountain Hellion Alpha",
  "Enslaved Hellion",
  "Shackled Hellion",
  "Farric Lynx Alpha",
  "Mountain Lynx",
  "Farrul, First of the Plains",
  "Farric Tiger Alpha",
  "Farric Goatman",
  "Primal Cystcaller",
  "Goatman",
  "Goatman Stomper",
  "Alpine Devil",
  "Hill Devil",
  "Colossus Crusher",
  "Goatman Shaman",
  "Goatman Fire-raiser",
  "Bearded Shaman",
  "Bearded Skycaller",
  "Alpine Shaman",
  "Farric Ape",
  "Blood Ape",
  "Dread Primate",
  "Stygian Ape",
  "Infested Ape",
  "Carnage Ape",
  "Barrow Ape",
  "Farric Chieftain",
  "Blood Chieftain",
  "Carnage Chieftain",
  "Stygian Silverback",
  "Host Chieftain",
  "Farric Wolf Alpha",
  "Arctic Wolf",
  "Snow Wolf",
  "Freezing Wolf",
  "Farric Magma Hound",
  "Primal Rhex Matriarch",
  "Fury Hound",
  "War Hound",
  "Farric Pit Hound",
  "Pitbull Demon",
  "Vicious Hound",
  "Purge Hound",
  "Farric Gargantuan",
  "Wild Bristle Matron",
  "Cave Beast",
  "Enraptured Beast",
  "Bone Cruncher",
  "Hairy Bonecruncher",
  "Shaggy Monstrosity",
  "Thicket Hulk",
  "Skeletal Beast",
  "Corrupted Beast",
  "Armour Cruncher",
  "Forest Beast",
  "Farric Ursa",
  "Plummeting Ursa",
  "Tunnelfiend",
  "Infested Tunnelfiend",
  "Woods Ursa",
  "Infested Ursa",
  "The Black Mórrigan",
  "Farric Goliath",
  "Porcupine Goliath",
  "Chrome-touched Goliath",
  "Chrome-infused Goliath",
  "Farric Taurus",
  "Fighting Bull",
  "Avalanche Rider",
  "Grazing Taurus",
  "Wild Brambleback",
  "Saqawine Rhoa",
  "Rhoa Mare",
  "Tercel Rhoa",
  "Murk Runner",
  "Bone Rhoa",
  "Corrupted Rhoa",
  "Infested Rhoa",
  "Saqawine Retch",
  "Avian Retch",
  "Gluttonous Gull",
  "Saqawine Vulture",
  "Vivid Vulture",
  "Mindless Scavenger",
  "Scavenging Vulture",
  "Rotting Vulture",
  "Infested Vulture",
  "Rooster Fiend",
  "Talon Archer",
  "Feral Fowl",
  "Saqawal, First of the Sky",
  "Saqawine Rhex",
  "Wild Rhex",
  "Maternal Rhex",
  "Adolescent Rhex",
  "Escaped Rhex",
  "Saqawine Cobra",
  "Saqawine Blood Viper",
  "Night Adder",
  "Host Adder",
  "Bramble Cobra",
  "Host Cobra",
  "Acid Slitherer",
  "Glade Mamba",
  "Spine Serpent",
  "Infested Serpent",
  "Barb Serpent",
  "Sand Serpent",
  "Saqawine Chimeral",
  "Plumed Chimeral",
  "Feral Chimeral",
  "Chrome-touched Chimeral",
  "Chrome-infused Chimeral",
  "Fenumal Queen",
  "Carrion Queen",
  "Carrion Minion",
  "Carrion Swarmer",
  "Carrion Burrower",
  "Scum Crawler",
  "Fenumal Scrabbler",
  "Dust Scrabbler",
  "Dirt Scrabbler",
  "Infested Skitterer",
  "Lowlands Hopper",
  "Sand Skitterer",
  "Sand Leaper",
  "Parasite",
  "Ravenous Parasite",
  "Plated Parasite",
  "Spitting Parasite",
  "Vicious Parasite",
  "Fenumal Plagued Arachnid",
  "Fenumal Widow",
  "Lurking Venom",
  "Vaal Recluse",
  "Noxious Tarantula",
  "Leaping Spider",
  "Arakaali's Daughter",
  "Webbed Spider",
  "Virulent Spider",
  "Corrupted Arach",
  "Crypt Weaver",
  "Mutant Arach",
  "Crypt Ambusher",
  "Corrupted Spitter",
  "Cave Skitterer",
  "Spindle Spider",
  "Maligaro's Inspiration",
  "Enraptured Arachnid",
  "Plagued Arachnid",
  "Maligaro's Muse",
  "Ink Spinner",
  "Fenumal Devourer",
  "Devourer",
  "Fenumus, First of the Night",
  "Fenumal Hybrid Arachnid",
  "Vivid Abberarach",
  "Hybrid Arachnid",
  "Scalding Arachnid",
  "Fenumal Scorpion",
  "Black Scorpion",
  "Sulphuric Scorpion",
  "Sand Scorpion",
  "Predatory Scorpion",
  "Craicic Squid",
  "Merveil's Daughter",
  "Merveil's Attendant",
  "Merveil's Chosen",
  "Merveil's Retainer",
  "Singing Siren",
  "Merveil's Blessed",
  "Cursed Spawn",
  "Unstable Larva",
  "Slimy Nemesis",
  "Venomous Spawn",
  "Craicic Watcher",
  "Vivid Watcher",
  "Soulless Watcher",
  "Cavern Drifter",
  "Sewer Drifter",
  "Craicic Vassal",
  "Brine Vassal",
  "Swarthy Mollusc",
  "Craicic Sand Spitter",
  "Gravel Eater",
  "Granite Eater",
  "Rock Spitter",
  "Crustacean Sniper",
  "Sewage Crawler",
  "Toxic Crawler",
  "Craicic Shield Crab",
  "Scrabbling Menace",
  "Cave Crustacean",
  "Invading Crustacean",
  "Infested Crustacean",
  "Shield Crab",
  "Bleached Crustacean",
  "Craicic Savage Crab",
  "Primal Crushclaw",
  "Savage Crab",
  "Infested Crab",
  "Enraptured Crab",
  "Infested Crawler",
  "Bleached Crawler",
  "Craiceann, First of the Deep",
  "Waste Lurcher",
  "Sulphurspawn",
  "Craicic Spider Crab",
  "Craicic Maw",
  "Fetid Maw",
  "Filth Maw",
  "Infested Maw",
  "Craicic Chimeral",
  "Chimeric Croaker",
  "Vaulting Croaker",
  "Chrome-touched Croaker",
  "Chrome-infused Croaker",
  "Wild Chimeral",
];

const classToBaseType: Record<string, string> = {
  StackableCurrency: "Chaos Orb",
  DelveSocketableCurrency: "Potent Alchemical Resonator",
  DelveStackableSocketableCurrency: "Potent Alchemical Resonator",
  GiftBox: "Wrapped Gift",
  "Two Hand Sword": "Banishing Blade",
  Wand: "Accumulator Wand",
  Dagger: "Ambusher",
  "Rune Dagger": "Boot Blade",
  Claw: "Awl",
  "One Hand Axe": "Arming Axe",
  "One Hand Sword": "Anarchic Spiritblade",
  "Thrusting One Hand Sword": "Antique Rapier",
  "One Hand Mace": "Ancestral Club",
  Sceptre: "Abyssal Sceptre",
  Bow: "Assassin Bow",
  Staff: "Battery Staff",
  Warstaff: "Capacity Rod",
  "Two Hand Axe": "Abyssal Axe",
  "Two Hand Mace": "Blunt Force Condenser",
  FishingRod: "Fishing Rod",
  Ring: "Amethyst Ring",
  Amulet: "Agate Amulet",
  Belt: "Heavy Belt",
  Shield: "Alder Spiked Shield",
  Helmet: "Ancient Mask",
  "Body Armour": "Arcane Vestment",
  Boots: "Ambush Boots",
  Gloves: "Aetherwind Gloves",
  LifeFlask: "Colossal Life Flask",
  ManaFlask: "Colossal Mana Flask",
  HybridFlask: "Colossal Hybrid Flask",
  UtilityFlask: "Amethyst Flask",
  Quiver: "Artillery Quiver",
  "Active Skill Gem": "Absolution",
  "Support Skill Gem": "Added Chaos Damage Support",
  Jewel: "Cobalt Jewel",
  AbyssJewel: "Ghastly Eye Jewel",
  Map: "Map",
  MapFragment: "Abyss Scarab",
  Breachstone: "Chayula's Breachstone",
  VaultKey: "Ancient Reliquary Key",
  InstanceLocalItem: "Agility Contract",
  DivinationCard: "A Chilling Wind",
  Currency: "Mystery Leaguestone",
  IncubatorStackable: "Abyssal Incubator",
  AtlasUpgradeItem: "Ceremonial Voidstone",
  HeistContract: "Contract: Bunker",
  HeistBlueprint: "Blueprint: Bunker",
  HeistEquipmentUtility: "Hooded Cloak",
  HeistEquipmentReward: "Enamel Brooch",
  HeistEquipmentTool: "Azurite Flashpowder",
  HeistEquipmentWeapon: "Aggregator Charm",
  ExpeditionLogbook: "Expedition Logbook",
  SentinelDrone: "Ancient Apex Sentinel",
  Relic: "Candlestick Relic",
  SanctumSpecialRelic: "Sanctified Relic",
  AtlasRelic: "Burial Idol",
  MemoryLine: "Alva's Memory",
  Gold: "Gold",
  ItemisedSanctum: "Forbidden Tome",
  Tincture: "Ashbark Tincture",
  AnimalCharm: "Corvine Charm",
  ItemisedCorpse: "Blasphemer",
  NecropolisPack: "Allflame Ember of Abyss",
  TransfiguredGem: "Lightning Arrow of Electrocution",
  MapKey: "Map (Tier 16)",
  BlightedMapKey: "Map (Tier 16)",
};

const anomalousBaseTypes: {
  [gameVersion: string]: Record<string, string>;
} = {
  poe1: beasts.reduce(
    (acc, beast) => {
      acc[beast] = "Bestiary_Orb";
      return acc;
    },
    {} as Record<string, string>,
  ),
  poe2: {},
};

// Splits on commas; `\,` keeps a literal comma and `\\` a literal backslash.
export function splitEscaped(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === "\\" && (value[i + 1] === "," || value[i + 1] === "\\")) {
      current += value[++i];
    } else if (c === ",") {
      parts.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  parts.push(current.trim());
  return parts;
}

export function getItemName(
  objective: ScoreObjective | Objective,
): string | null {
  if (!objective) {
    return null;
  }
  for (const condition of objective.conditions) {
    if (condition.field === ItemField.NAME) {
      if (condition.operator === Operator.EQ) {
        return condition.value.replaceAll("Foulborn ", "");
      } else if (condition.operator === Operator.IN) {
        return splitEscaped(condition.value)[0].replaceAll("Foulborn ", "");
      }
    } else if (condition.field === ItemField.BASE_TYPE) {
      if (condition.operator === Operator.EQ) {
        return condition.value;
      } else if (condition.operator === Operator.IN) {
        return splitEscaped(condition.value)[0];
      }
    }
  }
  return null;
}
function getFirstConditionValue(condition: Condition): string {
  if (condition.operator === Operator.EQ) {
    return condition.value;
  } else if (condition.operator === Operator.IN) {
    return splitEscaped(condition.value)[0];
  }
  return "";
}

export function stripFoulbornName(name: string): string {
  return name.startsWith("Foulborn ") ? name.slice("Foulborn ".length) : name;
}

export function encode(string: string): string {
  return string
    .replaceAll(" ", "_")
    .replaceAll("%", "")
    .replaceAll(",", "")
    .replaceAll("'", "")
    .replaceAll(":", "")
    .replaceAll('"', "");
}

export function findFirstItemImage(
  objective: ScoreObjective | Objective,
  gameVersion: GameVersion = GameVersion.poe1,
): string | null {
  if (!objective) {
    return null;
  }
  let loc = getImageLocation(objective, gameVersion);
  if (loc) return loc;
  for (const child of objective.children) {
    loc = findFirstItemImage(child, gameVersion);
    if (loc) return loc;
  }
  return null;
}

function uniqueImage(
  name: string,
  objective: ScoreObjective | Objective,
  gameVersion: GameVersion,
): string {
  const anomaly = anomalousUniques[gameVersion][name];
  if (anomaly) {
    return `/assets/${gameVersion}/items/uniques/${
      anomaly[objective.extra] || Object.values(anomaly)[0]
    }.webp`;
  }
  return `/assets/${gameVersion}/items/uniques/${encode(name)}.webp`;
}

function baseTypeImage(baseType: string, gameVersion: GameVersion): string {
  const file = anomalousBaseTypes[gameVersion][baseType] ?? encode(baseType);
  return `/assets/${gameVersion}/items/basetypes/${file}.webp`;
}

function imageForCondition(
  condition: Condition,
  objective: ScoreObjective | Objective,
  gameVersion: GameVersion,
): string | null | undefined {
  const value = getFirstConditionValue(condition);
  if (!value) return undefined;
  switch (condition.field) {
    case ItemField.NAME: {
      const name = value.replaceAll("Foulborn ", "");
      return name ? uniqueImage(name, objective, gameVersion) : undefined;
    }
    case ItemField.BASE_TYPE:
      return baseTypeImage(value, gameVersion);
    case ItemField.ITEM_CLASS: {
      const baseType = classToBaseType[value];
      return baseType
        ? `/assets/${gameVersion}/items/basetypes/${encode(baseType)}.webp`
        : null;
    }
  }
}

/**
 * The first name, base type or item class condition with a value decides the
 * image (`undefined` = keep looking, `null` = unknown item class).
 */
export function getImageLocation(
  objective: ScoreObjective | Objective,
  gameVersion: GameVersion = GameVersion.poe1,
): string | null {
  for (const condition of objective?.conditions ?? []) {
    const image = imageForCondition(condition, objective, gameVersion);
    if (image !== undefined) return image;
  }
  return null;
}
