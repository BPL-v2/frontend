import type { ScoringPresetCreate } from "./scoringPresetCreate";

export type CreateScoringPresetBaseBody =
  | { [key: string]: unknown }
  | ScoringPresetCreate;
