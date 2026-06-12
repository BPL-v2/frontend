import type { PassivesJewelData } from "./passivesJewelData.ts";
import type { PassivesMasteryEffects } from "./passivesMasteryEffects.ts";
import type { PassivesSkillOverrides } from "./passivesSkillOverrides.ts";
import type { Specialisations } from "./specialisations.ts";

export interface Passives {
  alternate_ascendancy?: string;
  bandit_choice?: string;
  hashes?: number[];
  hashes_ex?: number[];
  jewel_data?: PassivesJewelData;
  mastery_effects?: PassivesMasteryEffects;
  pantheon_major?: string;
  pantheon_minor?: string;
  /** PoE2 only; passives granted via quests */
  quest_stats?: string[];
  skill_overrides?: PassivesSkillOverrides;
  specialisation?: Specialisations;
}
