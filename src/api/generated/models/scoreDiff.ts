import type { Difftype } from "./difftype";
import type { Score } from "./score";

export interface ScoreDiff {
  diff_type: Difftype;
  field_diff: string[];
  objective_id: number;
  score: Score;
  team_id: number;
}
