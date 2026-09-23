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
  suggestion = ensurePartners(suggestion, lockedSignups);
  suggestion = improveFairness(suggestion, currentEvent, lockedSignups);
  return suggestion;
}

const randSort = () => Math.random() - 0.5;

type LockedSignups = { [userId: number]: number };

/** Users whose partner is already on the same team. */
function findMatchedPartners(
  signups: SortedSignup[],
  userToSignup: Map<number, SortedSignup>,
): Set<number> {
  const matched = new Set<number>();
  for (const signup of signups) {
    const partner = signup.partner_id
      ? userToSignup.get(signup.partner_id)
      : undefined;
    if (partner?.team_id && partner.team_id === signup.team_id) {
      matched.add(partner.user.id);
      matched.add(signup.user.id);
    }
  }
  return matched;
}

/** Moves users onto the team of their (mutual) partner where possible. */
function ensurePartners(
  signups: SortedSignup[],
  lockedSignups: LockedSignups,
): SortedSignup[] {
  const userToSignup = new Map(
    signups.map((signup) => [signup.user.id, signup]),
  );
  const matchedPartners = findMatchedPartners(signups, userToSignup);

  return signups.map((signup) => {
    if (
      lockedSignups[signup.user.id] ||
      !signup.partner_id ||
      matchedPartners.has(signup.user.id)
    ) {
      return signup;
    }
    const partner = userToSignup.get(signup.partner_id);
    if (!partner?.team_id || partner.partner_id !== signup.user.id) {
      return signup;
    }
    matchedPartners.add(signup.user.id);
    matchedPartners.add(signup.partner_id);
    return { ...signup, team_id: partner.team_id };
  });
}

function improveFairness(
  signups: SortedSignup[],
  currentEvent: Event,
  lockedSignups: LockedSignups,
) {
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
      if (lockedSignups[signup.user.id] || signup.partner_id) {
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
