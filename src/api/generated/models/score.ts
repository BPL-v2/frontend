import type { Completion } from "./completion.ts";

export interface Score {
  bonus_points: number;
  completions: Completion[];
}
