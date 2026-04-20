import type { Completion } from "./completion";

export interface Score {
  bonus_points: number;
  completions: Completion[];
}
