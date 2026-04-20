import { LadderEntry } from "@api";
import {
  calculatePolicyEntries,
  maxCustomPoPoints,
} from "@utils/personal-points";
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

export default function CustomPoPoints({
  char,
}: {
  char?: LadderEntry;
}): React.JSX.Element {
  const entries = calculatePolicyEntries(char);
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
