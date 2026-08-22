import { LadderEntry } from "@api";
import {
  calculatePolicyEntries,
  maxCustomPoPoints,
  pointsPerThreshold,
} from "@utils/personal-points";
import React from "react";
import { twMerge } from "tailwind-merge";

const policyKeys: Partial<Record<keyof LadderEntry, string>> = {
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

const explainers: Partial<Record<keyof LadderEntry, string>> = {
  voidstones: "Voidstones need to be in your inventory while we do a character scan. Put them in your inventory and click the 'Update Character' button to earn points.",
}

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
            const render = (
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
                <div className="flex gap-1.5">
                  {segments.map((fill, i) => {
                    if (fill === null) return null;
                    return (
                      <div
                        key={i}
                        className="tooltip flex-1"
                        data-tip={`${thresholds[i]?.toLocaleString()} for +${pointsPerThreshold[i]}`}
                      >
                        <div className="h-2 w-full overflow-hidden rounded-full bg-base-content/10">
                          <div
                            className={twMerge(
                              "h-full rounded-full transition-all duration-500 ease-out",
                              fill === 1
                                ? "bg-gradient-to-r from-success/80 to-success shadow-[0_0_6px_var(--color-success)]"
                                : fill > 0
                                  ? "bg-gradient-to-r from-warning/70 to-warning"
                                  : "",
                            )}
                            style={{ width: `${fill * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
            if (explainers[key]) {
              return (
                <div key={key} className="tooltip" >
                  <div className="tooltip-content text-xl">{explainers[key]}</div>
                  {render}
                </div>
              );
            }
            return render;
          },
        )}
      </div>
    </div>
  );
}
