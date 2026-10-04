import { Event, ExtendedSignup } from "@api";

export type SortedSignup = ExtendedSignup & {
  sorted?: boolean;
};

export type SortBucketConfig = {
  bucketKeys: string[];
  totalBucketKey: string;
  getSignupBuckets: (signup: SortedSignup) => string[];
};

export function sortUsers(
  currentEvent: Event,
  signups: SortedSignup[],
  bucketConfig: SortBucketConfig,
): SortedSignup[] {
  const lockedSignups: LockedSignups = {};
  for (const signup of signups) {
    if (signup.team_id) {
      lockedSignups[signup.user.id] = signup.team_id;
    }
  }
  let suggestion = getSortSuggestion(currentEvent, signups, bucketConfig);
  suggestion = improveFairness(suggestion, currentEvent, lockedSignups);
  suggestion = ensureGroups(suggestion, lockedSignups);
  suggestion = improveFairness(suggestion, currentEvent, lockedSignups);
  return suggestion;
}

const randSort = () => Math.random() - 0.5;

type LockedSignups = { [userId: number]: number };

/**
 * Maps every user that signed up as part of a group to their group id.
 */
export function buildGroups(signups: ExtendedSignup[]): Map<number, string> {
  const groups = new Map<number, string>();
  for (const signup of signups) {
    if (signup.group_key) {
      groups.set(signup.user.id, `group:${signup.group_key}`);
    }
  }
  // groups with a single member are no group
  const sizes = new Map<string, number>();
  for (const id of groups.values()) sizes.set(id, (sizes.get(id) ?? 0) + 1);
  for (const [userId, id] of groups) {
    if (sizes.get(id) === 1) groups.delete(userId);
  }
  return groups;
}

/** Moves all unlocked members of a group onto the team most of the group is on. */
function ensureGroups(
  signups: SortedSignup[],
  lockedSignups: LockedSignups,
): SortedSignup[] {
  const groups = buildGroups(signups);
  const members = new Map<string, SortedSignup[]>();
  for (const signup of signups) {
    const id = groups.get(signup.user.id);
    if (id) members.set(id, [...(members.get(id) ?? []), signup]);
  }
  const targetTeams = new Map<string, number>();
  for (const [id, group] of members) {
    // locked members decide first, then the most common team of the group
    const candidates = group.some((m) => lockedSignups[m.user.id])
      ? group.filter((m) => lockedSignups[m.user.id])
      : group;
    const votes = new Map<number, number>();
    for (const member of candidates) {
      if (member.team_id) {
        votes.set(member.team_id, (votes.get(member.team_id) ?? 0) + 1);
      }
    }
    const best = [...votes.entries()].sort((a, b) => b[1] - a[1])[0];
    if (best) targetTeams.set(id, best[0]);
  }
  return signups.map((signup) => {
    const id = groups.get(signup.user.id);
    const team = id ? targetTeams.get(id) : undefined;
    if (!team || lockedSignups[signup.user.id] || signup.team_id === team) {
      return signup;
    }
    return { ...signup, team_id: team };
  });
}

function improveFairness(
  signups: SortedSignup[],
  currentEvent: Event,
  lockedSignups: LockedSignups,
) {
  const groups = buildGroups(signups);
  // tries to balance out team sizes
  for (let i = 0; i < 100; i++) {
    const counts = getTeamCounts(signups, currentEvent);
    const minval = Math.min(...Object.values(counts));
    const maxval = Math.max(...Object.values(counts));
    if (maxval - minval <= 1) {
      // a difference of 1 between min and max can not be improved upon
      return signups;
    }
    const minTeam = Object.keys(counts).find(
      (key) => counts[parseInt(key)] === minval,
    );
    const maxTeam = Object.keys(counts).find(
      (key) => counts[parseInt(key)] === maxval,
    );
    for (const signup of signups.sort(randSort)) {
      if (lockedSignups[signup.user.id] || groups.has(signup.user.id)) {
        continue;
      }
      // switch out a user from the max team to the min team
      if (
        maxTeam &&
        minTeam &&
        signup.team_id === parseInt(maxTeam) &&
        !signup.sorted &&
        !lockedSignups[signup.user.id]
      ) {
        signup.team_id = parseInt(minTeam);
        break;
      }
    }
  }

  return signups;
}

function getTeamCounts(
  signups: SortedSignup[],
  currentEvent: Event,
): { [teamId: number]: number } {
  return signups.reduce(
    (acc, signup) => {
      if (signup.team_id) {
        acc[signup.team_id]++;
      }
      return acc;
    },
    currentEvent.teams.reduce(
      (acc, team) => {
        acc[team.id] = 0;
        return acc;
      },
      {} as { [teamId: number]: number },
    ),
  );
}

/** Tracks how many signups of each bucket every team has. */
function createBucketTracker(teamIds: number[], bucketKeys: string[]) {
  const buckets: { [key: string]: { [teamId: number]: number } } = {};
  const bucketTotals: { [key: string]: number } = {};
  for (const bucketKey of bucketKeys) {
    buckets[bucketKey] = Object.fromEntries(teamIds.map((id) => [id, 0]));
    bucketTotals[bucketKey] = 0;
  }

  return {
    add(teamId: number, signupBuckets: string[]) {
      for (const bucketKey of signupBuckets) {
        buckets[bucketKey][teamId] += 1;
        bucketTotals[bucketKey] += 1;
      }
    },
    countIn(bucketKey: string, teamId: number) {
      return buckets[bucketKey][teamId];
    },
    /** Squared distance from a perfectly even spread if the signup joined `teamId`. */
    scoreFor(teamId: number, signupBuckets: string[]) {
      let score = 0;
      for (const bucketKey of bucketKeys) {
        const inBucket = signupBuckets.includes(bucketKey) ? 1 : 0;
        const target = (bucketTotals[bucketKey] + inBucket) / teamIds.length;
        for (const candidateTeamId of teamIds) {
          const extra = candidateTeamId === teamId ? inBucket : 0;
          const diff = buckets[bucketKey][candidateTeamId] + extra - target;
          score += diff * diff;
        }
      }
      return score;
    },
  };
}

function getSortSuggestion(
  currentEvent: Event,
  signups: SortedSignup[],
  bucketConfig: SortBucketConfig,
) {
  const teamIds = currentEvent.teams.map((team) => team.id);
  const { totalBucketKey } = bucketConfig;
  const tracker = createBucketTracker(teamIds, bucketConfig.bucketKeys);

  for (const signup of signups) {
    if (signup.team_id) {
      tracker.add(signup.team_id, bucketConfig.getSignupBuckets(signup));
    }
  }

  const newSignups: SortedSignup[] = [];
  for (const signup of signups.slice().sort(randSort)) {
    if (signup.team_id) {
      newSignups.push(signup);
      continue;
    }
    const signupBuckets = bucketConfig.getSignupBuckets(signup);

    let bestTeamId: number | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const teamId of teamIds) {
      const score = tracker.scoreFor(teamId, signupBuckets);
      const tiedButSmaller =
        score === bestScore &&
        bestTeamId !== null &&
        tracker.countIn(totalBucketKey, teamId) <
          tracker.countIn(totalBucketKey, bestTeamId);
      if (score < bestScore || tiedButSmaller) {
        bestScore = score;
        bestTeamId = teamId;
      }
    }

    const assignedTeamId = bestTeamId ?? teamIds[0];
    newSignups.push({ ...signup, team_id: assignedTeamId });
    tracker.add(assignedTeamId, signupBuckets);
  }
  return newSignups;
}
