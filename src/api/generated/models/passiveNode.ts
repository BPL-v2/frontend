import type { PassiveNodeExpansionJewel } from './passiveNodeExpansionJewel';
import type { PassiveNodeMasteryEffect } from './passiveNodeMasteryEffect';

export interface PassiveNode {
  activeEffectImage?: string;
  activeIcon?: string;
  ascendancyName?: string;
  classStartIndex?: number;
  expansionJewel?: PassiveNodeExpansionJewel;
  flavourText?: string[];
  grantedDexterity?: number;
  grantedIntelligence?: number;
  grantedPassivePoints?: number;
  grantedStrength?: number;
  group?: string;
  icon?: string;
  in?: string[];
  inactiveIcon?: string;
  isAscendancyStart?: boolean;
  isBlighted?: boolean;
  isJewelSocket?: boolean;
  isKeystone?: boolean;
  isMastery?: boolean;
  isMultipleChoice?: boolean;
  isMultipleChoiceOption?: boolean;
  isNotable?: boolean;
  isProxy?: boolean;
  isTattoo?: boolean;
  masteryEffects?: PassiveNodeMasteryEffect[];
  name?: string;
  orbit?: number;
  orbitIndex?: number;
  out?: string[];
  recipe?: string[];
  reminderText?: string[];
  /** actually an int but it's a string in the ggg response */
  skill?: string;
  stats?: string[];
}
