import type { TeamSuggestion } from "./teamSuggestion";

export type CreateObjectiveTeamSuggestionBaseBody =
  | { [key: string]: unknown }
  | TeamSuggestion;
