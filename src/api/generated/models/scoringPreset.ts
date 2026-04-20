import type { ScoringMethod } from "./scoringMethod";
import type { ScoringPresetExtra } from "./scoringPresetExtra";

export interface ScoringPreset {
  description: string;
  extra?: ScoringPresetExtra;
  id: number;
  name: string;
  point_cap?: number;
  points: number[];
  scoring_method: ScoringMethod;
}
