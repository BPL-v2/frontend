import type { MercenarySkillSupport } from "./mercenarySkillSupport.ts";

export interface MercenarySkill {
  hash: number;
  icon: string;
  name: string;
  supports?: MercenarySkillSupport[];
}
