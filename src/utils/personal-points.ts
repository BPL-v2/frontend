import { LadderEntry } from "@api";

export function totalPoPoints(ladderEntry: LadderEntry) {
  return generalPoPoints(ladderEntry) + customPoPoints(ladderEntry);
}

export function progressiveDelveDepth(entry: LadderEntry) {
  return Math.floor(
    (entry.delve_depth - 100) * progressiveDelveMultiplier(entry.delve_depth),
  );
}
function progressiveDelveMultiplier(depth: number) {
  if (depth < 100) {
    return 0;
  }
  if (depth < 150) {
    return 1;
  }
  if (depth < 250) {
    return 1.2;
  }
  if (depth < 350) {
    return 1.4;
  }
  if (depth < 450) {
    return 1.6;
  }
  if (depth < 550) {
    return 1.8;
  }
  return 2;
}

export function generalPoPoints(char: LadderEntry) {
  let points = 0;
  if (char.level >= 40) points += 1;
  if (char.level >= 60) points += 1;
  if (char.level >= 80) points += 1;
  if (char.ascendancy_points >= 4) points += 1;
  if (char.ascendancy_points >= 6) points += 1;
  if (char.ascendancy_points >= 8) points += 1;
  if (char.level >= 90) {
    points += 3;
  } else if (char.atlas_points >= 40) {
    points += 3;
  }
  return points;
}

export function customPoPoints(char: LadderEntry) {
  const entries = calculatePolicyEntries(char);
  return Math.min(
    entries.reduce((sum, e) => sum + (e.earnedPoints ?? 0), 0),
    maxCustomPoPoints,
  );
}

type POPolicies = Partial<Record<keyof LadderEntry, (number | null)[]>>;

var policies: POPolicies = {
  armour: [30000, 60000, 90000],
  evasion: [30000, 60000, 90000],
  level: [null, 95, 98],
  voidstones: [null, null, 4],
  high_level_flasks: [5, null, null],
  movement_speed: [150, 250, 350],
  es: [9000, 12000, 15000],
  hp: [5500, 6250, 7000],
  mana: [8000, 12000, 15000],
  dps: [5000000, 10000000, 32000000],
  ehp: [50000, 150000, 400000],
  attack_block: [75, 80, 83],
  lowest_ele_res: [84, 90, null],
  ele_max_hit: [40000, 80000, 120000],
  phys_max_hit: [12000, 16000, 20000],
};

export const maxCustomPoPoints = 8;
export const pointsPerThreshold = [1, 2, 4];

export function calculatePolicyEntries(char?: LadderEntry) {
  return Object.entries(policies).map((entry) => {
    const key = entry[0] as keyof LadderEntry;
    const thresholds = entry[1];
    const charValue = (char?.[key] as number) || 0;

    const getPrevValue = (i: number): number => {
      for (let j = i - 1; j >= 0; j--) {
        if (thresholds[j] !== null) return thresholds[j] as number;
      }
      return 0;
    };

    const segments = thresholds.map((threshold, i) => {
      if (threshold === null) return null;
      if (charValue >= threshold) return 1;
      const prev = getPrevValue(i);
      if (charValue <= prev) return 0;
      return (charValue - prev) / (threshold - prev);
    });

    const earnedPoints = segments.reduceRight(
      (pts, fill, i) => {
        if (pts !== null) return pts;
        if (fill === 1) return pointsPerThreshold[i];
        return null;
      },
      null as number | null,
    );

    return { key, thresholds, charValue, segments, earnedPoints };
  });
}
