import type { TeamSuggestion } from "./teamSuggestion.ts";

export type CreateObjectiveTeamSuggestionBaseBody =
  | { [key: string]: unknown }
  | TeamSuggestion;
