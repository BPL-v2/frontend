import { LadderEntry } from "@api";
import React from "react";
import { PoGauge } from "./po-gauge";
import { twMerge } from "tailwind-merge";

function totalPoPoints(char: LadderEntry) {
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

export default function GeneralPoPoints({
  char,
}: {
  char?: LadderEntry;
}): React.JSX.Element {
  const limit = 9;
  char =
    char ||
    ({
      level: 0,
      ascendancy_points: 0,
      atlas_points: 0,
    } as LadderEntry);
  const reachedPoints = totalPoPoints(char);
  return (
    <div className="flex flex-col gap-1">
      <span>
        General Personal Objective Points based on your character{" "}
        <span
          className={twMerge(
            "text-warning",
            reachedPoints >= limit && "text-success",
          )}
        >
          (Total: {reachedPoints}/{limit})
        </span>
        :
      </span>
      <PoGauge
        descriptions={["Lvl 40", "Lvl 60", "Lvl 80"]}
        values={[
          char.level >= 40 ? 1 : 0,
          char.level >= 60 ? 1 : 0,
          char.level >= 80 ? 1 : 0,
        ]}
        cap={3}
      ></PoGauge>
      <PoGauge
        descriptions={["Cruel Lab", "Merc Lab", "Uber Lab"]}
        values={[
          char.ascendancy_points >= 4 ? 1 : 0,
          char.ascendancy_points >= 6 ? 1 : 0,
          char.ascendancy_points >= 8 ? 1 : 0,
        ]}
        cap={3}
      ></PoGauge>
      <PoGauge
        descriptions={["Lvl 90", "40 Atlas Points"]}
        values={[char.level >= 90 ? 3 : 0, char.atlas_points >= 40 ? 3 : 0]}
        cap={3}
      ></PoGauge>
    </div>
  );
}
