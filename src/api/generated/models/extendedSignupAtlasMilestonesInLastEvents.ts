import type { AtlasMilestones } from "./atlasMilestones.ts";

/**
 * AtlasMilestonesInLastEvents holds, per recent event with atlas history, how many hours the player
 * was actively playing before reaching 1 and 80 atlas points.
 */
export type ExtendedSignupAtlasMilestonesInLastEvents = {
  [key: string]: AtlasMilestones;
};
