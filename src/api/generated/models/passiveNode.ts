import type { PassiveNodeExpansionJewel } from "./passiveNodeExpansionJewel.ts";
import type { PassiveNodeMasteryEffect } from "./passiveNodeMasteryEffect.ts";

export interface PassiveNode {
  /** ActiveEffectImage active mastery or tattoo background image */
  activeEffectImage?: string;
  /** ActiveIcon active mastery image */
  activeIcon?: string;
  ascendancyName?: string;
  classStartIndex?: number;
  expansionJewel?: PassiveNodeExpansionJewel;
  flavourText?: string[];
  /** GrantedDexterity sum of stats on this node that grant dexterity */
  grantedDexterity?: number;
  /** GrantedIntelligence sum of stats on this node that grant intelligence */
  grantedIntelligence?: number;
  grantedPassivePoints?: number;
  /** GrantedStrength sum of stats on this node that grant strength */
  grantedStrength?: number;
  /** Group the key value to look up in the groups table */
  group?: string;
  icon?: string;
  /** In node identifiers of nodes connected to this one */
  in: string[];
  /** InactiveIcon inactive mastery image */
  inactiveIcon?: string;
  /** IsAscendancyStart always true if present */
  isAscendancyStart?: boolean;
  /** IsBlighted always true if present */
  isBlighted?: boolean;
  /** IsJewelSocket always true if present */
  isJewelSocket?: boolean;
  /** IsKeystone always true if present */
  isKeystone?: boolean;
  /** IsMastery always true if present */
  isMastery?: boolean;
  /** IsMultipleChoice always true if present */
  isMultipleChoice?: boolean;
  /** IsMultipleChoiceOption always true if present */
  isMultipleChoiceOption?: boolean;
  /** IsNotable always true if present */
  isNotable?: boolean;
  /** IsProxy always true if present */
  isProxy?: boolean;
  /** IsTattoo always true if present */
  isTattoo?: boolean;
  masteryEffects?: PassiveNodeMasteryEffect[];
  name?: string;
  /** Orbit the orbit this node occupies within it's group */
  orbit?: number;
  /** OrbitIndex the index of this node in the group's orbit */
  orbitIndex?: number;
  /** Out node identifiers of nodes this one connects to */
  out: string[];
  /**
   * Recipe components required for Blight crafting this node.
   *             each string is one of ClearOil, SepiaOil, AmberOil, VerdantOil,
   * TealOil, AzureOil, IndigoOil, VioletOil, CrimsonOil,
   * BlackOil, OpalescentOil, SilverOil, GoldenOil, or PrismaticOil
   */
  recipe?: string[];
  reminderText?: string[];
  /** Skill skill hash */
  skill?: number;
  /** Stats stat descriptions */
  stats?: string[];
}
