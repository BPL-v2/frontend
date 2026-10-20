import { describe, expect, it } from "vitest";
import type { ExtendedSignup } from "@api";
import {
  atlasMilestones,
  atlasSpeedBucketKey,
  atlasSpeedBuckets,
  describeAtlasSpeedBucket,
  getAtlasMilestoneHours,
  getAtlasSpeedBucket,
} from "./atlas-speed";

function signup(
  events: Record<
    number,
    { first_point_active_hours?: number; eighty_points_active_hours?: number }
  >,
) {
  return {
    atlas_milestones_in_last_events: events,
  } as unknown as Pick<ExtendedSignup, "atlas_milestones_in_last_events">;
}

describe("getAtlasMilestoneHours", () => {
  it("averages the events the milestone was reached in", () => {
    const s = signup({
      111: { first_point_active_hours: 4, eighty_points_active_hours: 10 },
      112: { first_point_active_hours: 6 },
    });
    expect(getAtlasMilestoneHours(s, "firstPoint")).toBe(5);
    expect(getAtlasMilestoneHours(s, "eightyPoints")).toBe(10);
  });

  it("is null without data, also for null values from the api", () => {
    expect(getAtlasMilestoneHours(signup({}), "firstPoint")).toBeNull();
    const withNull = signup({
      111: {
        first_point_active_hours: null,
      } as unknown as { first_point_active_hours?: number },
    });
    expect(getAtlasMilestoneHours(withNull, "firstPoint")).toBeNull();
    expect(
      getAtlasMilestoneHours(
        {} as Pick<ExtendedSignup, "atlas_milestones_in_last_events">,
        "firstPoint",
      ),
    ).toBeNull();
  });
});

describe("getAtlasSpeedBucket", () => {
  it("splits first point times into fast, medium and slow", () => {
    const bucket = (hours: number) =>
      getAtlasSpeedBucket(
        signup({ 1: { first_point_active_hours: hours } }),
        "firstPoint",
      );
    expect(bucket(2)).toBe("fast");
    expect(bucket(3.4)).toBe("fast");
    expect(bucket(4.5)).toBe("medium");
    expect(bucket(5.2)).toBe("medium");
    expect(bucket(5.3)).toBe("slow");
  });

  it("splits 80 point times into fast, medium and slow", () => {
    const bucket = (hours: number) =>
      getAtlasSpeedBucket(
        signup({ 1: { eighty_points_active_hours: hours } }),
        "eightyPoints",
      );
    expect(bucket(9)).toBe("fast");
    expect(bucket(13)).toBe("medium");
    expect(bucket(20)).toBe("slow");
  });

  it("puts players without data in the unknown bucket", () => {
    expect(getAtlasSpeedBucket(signup({}), "firstPoint")).toBe("unknown");
    // reached the first point, but never 80 points
    const s = signup({ 1: { first_point_active_hours: 4 } });
    expect(getAtlasSpeedBucket(s, "eightyPoints")).toBe("unknown");
  });
});

describe("atlasSpeedBucketKey", () => {
  it("is unique for every milestone and bucket", () => {
    const keys = atlasMilestones.flatMap((milestone) =>
      atlasSpeedBuckets.map((bucket) => atlasSpeedBucketKey(milestone, bucket)),
    );
    expect(new Set(keys).size).toBe(8);
  });
});

describe("describeAtlasSpeedBucket", () => {
  it("describes the ranges the buckets are split at", () => {
    expect(describeAtlasSpeedBucket("firstPoint", "fast")).toBe(
      "up to 3.4 h of active play",
    );
    expect(describeAtlasSpeedBucket("firstPoint", "medium")).toBe(
      "3.4-5.2 h of active play",
    );
    expect(describeAtlasSpeedBucket("eightyPoints", "slow")).toBe(
      "over 15.2 h of active play",
    );
    expect(describeAtlasSpeedBucket("eightyPoints", "unknown")).toBe(
      "No data from the last events",
    );
  });
});
