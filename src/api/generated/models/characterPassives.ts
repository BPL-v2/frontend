import type { CharacterPassivesBanditChoice } from "./characterPassivesBanditChoice.ts";
import type { CharacterPassivesJewelData } from "./characterPassivesJewelData.ts";
import type { CharacterPassivesMasteryEffects } from "./characterPassivesMasteryEffects.ts";
import type { CharacterPassivesPantheonMajor } from "./characterPassivesPantheonMajor.ts";
import type { CharacterPassivesPantheonMinor } from "./characterPassivesPantheonMinor.ts";
import type { CharacterPassivesSkillOverrides } from "./characterPassivesSkillOverrides.ts";
import type { CharacterPassivesSpecialisations } from "./characterPassivesSpecialisations.ts";

export interface CharacterPassives {
  /** AlternateAscendancy PoE1 only; Bloodline class name */
  alternate_ascendancy?: string;
  bandit_choice?: CharacterPassivesBanditChoice;
  hashes: number[];
  /** HashesEx PoE1 only */
  hashes_ex: number[];
  /** JewelData the key is the string value of the x property of an item from the jewels array in this request */
  jewel_data: CharacterPassivesJewelData;
  /** MasteryEffects PoE1 only; the key is the string value of the mastery node skill hash and the value is the selected effect hash */
  mastery_effects: CharacterPassivesMasteryEffects;
  pantheon_major?: CharacterPassivesPantheonMajor;
  pantheon_minor?: CharacterPassivesPantheonMinor;
  /** QuestStats PoE2 only; passives granted via quests */
  quest_stats?: string[];
  /** SkillOverrides the key is the string value of the node identifier being replaced */
  skill_overrides: CharacterPassivesSkillOverrides;
  /** Specialisations PoE2 only; the keys are set1, set2, and set3 */
  specialisations: CharacterPassivesSpecialisations;
}
