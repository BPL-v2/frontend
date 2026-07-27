import type { Support } from "./support.ts";

export interface ItemMercenarySkill {
  hash: number;
  icon: string;
  name: string;
  supports?: Support[];
}
