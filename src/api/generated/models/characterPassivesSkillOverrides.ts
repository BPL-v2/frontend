import type { PassiveNode } from "./passiveNode.ts";

/**
 * SkillOverrides the key is the string value of the node identifier being replaced
 */
export type CharacterPassivesSkillOverrides = { [key: string]: PassiveNode };
