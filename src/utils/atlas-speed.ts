import type { ExtendedSignup } from "@api";

export const atlasMilestones = ["firstPoint", "eightyPoints"] as const;
export type AtlasMilestone = (typeof atlasMilestones)[number];

export const atlasSpeedBuckets = ["fast", "medium", "slow", "unknown"] as const;
export type AtlasSpeedBucket = (typeof atlasSpeedBuckets)[number];

/**
 * How much the atlas speed buckets count in the team sort compared to the other buckets (1).
 * There are more of them than of the participation and playtime buckets, so they are scaled down.
 */
export const atlasBucketWeight = 0.5;

/**
 * Upper limits (in hours of active playtime) of the fast and of the medium bucket. Everything above
 * the medium limit is slow. They are the terciles of the average over the last events with atlas
 * history (events 104 to 113), so each bucket holds about a third of the players that have a value.
 * Recalibrate them when there is a lot of new data.
 */
const speedLimits: Record<AtlasMilestone, { fast: number; medium: number }> = {
  firstPoint: { fast: 3.4, medium: 5.2 },
  eightyPoints: { fast: 10.9, medium: 15.2 },
};

type SignupWithAtlasMilestones = Pick<
  ExtendedSignup,
  "atlas_milestones_in_last_events"
>;

/**
 * Average hours the player was actively playing (breaks do not count) before they first had the
 * milestone allocated, over the last events they reached it in. Null if they have no data.
 */
export function getAtlasMilestoneHours(
  signup: SignupWithAtlasMilestones,
  milestone: AtlasMilestone,
): number | null {
  const hours = Object.values(signup.atlas_milestones_in_last_events ?? {})
    .map((event) =>
      milestone === "firstPoint"
        ? event.first_point_active_hours
        : event.eighty_points_active_hours,
    )
    .filter((value): value is number => typeof value === "number");
  if (hours.length === 0) {
    return null;
  }
  return hours.reduce((sum, value) => sum + value, 0) / hours.length;
}

export function getAtlasSpeedBucket(
  signup: SignupWithAtlasMilestones,
  milestone: AtlasMilestone,
): AtlasSpeedBucket {
  const hours = getAtlasMilestoneHours(signup, milestone);
  if (hours === null) {
    return "unknown";
  }
  const limits = speedLimits[milestone];
  if (hours <= limits.fast) {
    return "fast";
  }
  if (hours <= limits.medium) {
    return "medium";
  }
  return "slow";
}

export function atlasSpeedBucketKey(
  milestone: AtlasMilestone,
  bucket: AtlasSpeedBucket,
): string {
  return `atlas:${milestone}:${bucket}`;
}

/** Human readable range of active hours a bucket stands for, for tooltips. */
export function describeAtlasSpeedBucket(
  milestone: AtlasMilestone,
  bucket: AtlasSpeedBucket,
): string {
  const limits = speedLimits[milestone];
  switch (bucket) {
    case "fast":
      return `up to ${limits.fast} h of active play`;
    case "medium":
      return `${limits.fast}-${limits.medium} h of active play`;
    case "slow":
      return `over ${limits.medium} h of active play`;
    case "unknown":
      return "No data from the last events";
  }
}
