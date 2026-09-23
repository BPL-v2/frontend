import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Event } from "@api";
import { sortUsers, type SortedSignup } from "./usersort";

// Deterministic PRNG so shuffles are reproducible.
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const event = {
  teams: [{ id: 1 }, { id: 2 }, { id: 3 }],
} as unknown as Event;

const config = {
  bucketKeys: ["total", "veteran"],
  totalBucketKey: "total",
  getSignupBuckets: (signup: SortedSignup) =>
    signup.expected_playtime > 10 ? ["total", "veteran"] : ["total"],
};

function makeSignup(
  id: number,
  extra: Partial<SortedSignup> = {},
): SortedSignup {
  return {
    user: { id },
    team_id: undefined,
    partner_id: undefined,
    expected_playtime: id % 2 === 0 ? 20 : 5,
    ...extra,
  } as unknown as SortedSignup;
}

function counts(signups: SortedSignup[]) {
  const result: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  for (const s of signups) if (s.team_id) result[s.team_id]++;
  return result;
}

describe("sortUsers", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockImplementation(seededRandom(42));
  });
  afterEach(() => vi.restoreAllMocks());

  it("assigns every signup to a team with balanced sizes", () => {
    const signups = Array.from({ length: 20 }, (_, i) => makeSignup(i + 1));
    const sorted = sortUsers(event, signups, config);
    expect(sorted).toHaveLength(20);
    expect(sorted.every((s) => s.team_id)).toBe(true);
    const c = Object.values(counts(sorted));
    expect(Math.max(...c) - Math.min(...c)).toBeLessThanOrEqual(1);
  });

  it("spreads high-playtime users across teams", () => {
    const signups = Array.from({ length: 18 }, (_, i) => makeSignup(i + 1));
    const sorted = sortUsers(event, signups, config);
    const veterans: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    for (const s of sorted) {
      if (s.expected_playtime > 10) veterans[s.team_id!]++;
    }
    const v = Object.values(veterans);
    expect(Math.max(...v) - Math.min(...v)).toBeLessThanOrEqual(2);
  });

  it("keeps pre-assigned signups on their team", () => {
    const signups = [
      makeSignup(1, { team_id: 2 }),
      makeSignup(2, { team_id: 2 }),
      ...Array.from({ length: 6 }, (_, i) => makeSignup(i + 3)),
    ];
    const sorted = sortUsers(event, signups, config);
    expect(sorted.find((s) => s.user.id === 1)!.team_id).toBe(2);
    expect(sorted.find((s) => s.user.id === 2)!.team_id).toBe(2);
    const c = Object.values(counts(sorted));
    expect(Math.max(...c) - Math.min(...c)).toBeLessThanOrEqual(1);
  });

  it("puts mutual partners on the same team", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      vi.spyOn(Math, "random").mockImplementation(seededRandom(seed));
      const signups = [
        makeSignup(1, { partner_id: 2 }),
        makeSignup(2, { partner_id: 1 }),
        makeSignup(3, { partner_id: 4 }),
        makeSignup(4, { partner_id: 3 }),
        ...Array.from({ length: 8 }, (_, i) => makeSignup(i + 5)),
      ];
      const sorted = sortUsers(event, signups, config);
      const team = (id: number) =>
        sorted.find((s) => s.user.id === id)!.team_id;
      expect(team(1)).toBe(team(2));
      expect(team(3)).toBe(team(4));
    }
  });

  it("moves a user next to a locked partner", () => {
    const signups = [
      makeSignup(1, { team_id: 2, partner_id: 2 }),
      makeSignup(2, { team_id: 3, partner_id: 1 }),
      makeSignup(3),
      makeSignup(4),
      makeSignup(5),
      makeSignup(6),
    ];
    const sorted = sortUsers(event, signups, config);
    const byId = new Map(sorted.map((s) => [s.user.id, s]));
    // 1 is locked on team 2, so its partner 2 (also locked) stays where it is
    expect(byId.get(1)!.team_id).toBe(2);
    expect(byId.get(2)!.team_id).toBe(3);
  });

  it("handles no signups", () => {
    expect(sortUsers(event, [], config)).toEqual([]);
  });
});
