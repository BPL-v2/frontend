import type { ScoringMethod } from './scoringMethod';
import type { ScoringPresetCreateExtra } from './scoringPresetCreateExtra';

export interface ScoringPresetCreate {
  description?: string;
  extra?: ScoringPresetCreateExtra;
  id?: number;
  name: string;
  point_cap?: number;
  points: number[];
  scoring_method: ScoringMethod;
}
