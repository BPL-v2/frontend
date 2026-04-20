import type { PassivesJewelData } from './passivesJewelData';
import type { PassivesMasteryEffects } from './passivesMasteryEffects';
import type { PassivesSkillOverrides } from './passivesSkillOverrides';
import type { Specialisations } from './specialisations';

export interface Passives {
  alternate_ascendancy?: string;
  bandit_choice?: string;
  hashes?: number[];
  hashes_ex?: number[];
  jewel_data?: PassivesJewelData;
  mastery_effects?: PassivesMasteryEffects;
  pantheon_major?: string;
  pantheon_minor?: string;
  skill_overrides?: PassivesSkillOverrides;
  specialisation?: Specialisations;
}
