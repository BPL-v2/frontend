import type { AtlasTrees } from "./atlasTrees.ts";

export interface Atlas {
  primary_index: number;
  trees: AtlasTrees;
  user_id: number;
}
