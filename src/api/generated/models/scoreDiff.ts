import type { Difftype } from "./difftype.ts";
import type { Score } from "./score.ts";

export interface ScoreDiff {
  diff_type: Difftype;
  field_diff: string[];
  objective_id: number;
  score: Score;
  team_id: number;
}
