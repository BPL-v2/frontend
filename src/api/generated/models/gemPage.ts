import type { ItemProperty } from "./itemProperty.ts";

export interface GemPage {
  description?: string;
  properties?: ItemProperty[];
  skillName?: string;
  stats?: string[];
}
