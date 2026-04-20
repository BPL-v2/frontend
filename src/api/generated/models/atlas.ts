import type { AtlasTrees } from "./atlasTrees";

export interface Atlas {
  primary_index: number;
  trees: AtlasTrees;
  user_id: number;
}
