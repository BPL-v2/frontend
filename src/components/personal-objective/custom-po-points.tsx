import { LadderEntry } from "@api";
import React from "react";
import { twMerge } from "tailwind-merge";

var policyKeys: Partial<Record<keyof LadderEntry, string>> = {
  armour: "Armor",
  evasion: "Evasion",
  level: "Level",
  voidstones: "Voidstones",
  high_level_flasks: "Magic ilvl 84 flasks",
  movement_speed: "Movement Speed",
  es: "Energy Shield",
  hp: "Life",
  mana: "Mana",
  dps: "DPS",
  ehp: "EHP",
  attack_block: "Attack Block",
  lowest_ele_res: "All Ele Max Res",
  ele_max_hit: "Ele Max Hit",
  phys_max_hit: "Phys Max Hit",
};

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

const maxCustomPoPoints = 8;
const pointsPerThreshold = [1, 2, 4];

function computeEntries(char?: LadderEntry) {
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

export default function CustomPoPoints({
  char,
}: {
  char?: LadderEntry;
}): React.JSX.Element {
  const entries = computeEntries(char);
  const totalEarnedPoints = Math.min(
    entries.reduce((sum, e) => sum + (e.earnedPoints ?? 0), 0),
    maxCustomPoPoints,
  );

  return (
    <div>
      Custom Personal Objective Points based on your character's current stats{" "}
      <span
        className={twMerge(
          totalEarnedPoints >= maxCustomPoPoints
            ? "text-success"
            : "text-warning",
        )}
      >
        (Total: {totalEarnedPoints}/{maxCustomPoPoints})
      </span>
      :
      <div className="grid grid-cols-5 gap-2">
        {entries.map(
          ({ key, thresholds, charValue, segments, earnedPoints }) => {
            return (
              <div
                key={key}
                className={twMerge(
                  "flex flex-col gap-1 rounded-box border-2 bg-base-300 p-4",
                  earnedPoints
                    ? "border-success"
                    : "border-transparent opacity-80",
                )}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {policyKeys[key]}: {charValue?.toLocaleString()}
                  </span>
                  {earnedPoints !== null && (
                    <span className="font-bold text-success">
                      +{earnedPoints}
                    </span>
                  )}
                </div>
                <div className="flex h-3 gap-0.5">
                  {segments.map((fill, i) =>
                    fill === null ? (
                      <div key={i} className="tooltip flex-1" data-tip="N/A">
                        <div className="h-full w-full rounded-sm bg-base-100 opacity-10" />
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="tooltip flex-1"
                        data-tip={thresholds[i]?.toLocaleString()}
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-sm bg-base-200">
                          <div
                            className={`absolute inset-y-0 left-0 ${fill === 1 ? "bg-success" : "bg-warning"}`}
                            style={{ width: `${fill * 100}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
