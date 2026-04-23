import { JSX, useContext } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { TrackedValue, ScoringRuleType } from "@api";

function racePointsToText(points: number[]): JSX.Element[] {
  const textParts = points.map((point, index) => {
    if (index === 0) {
      return (
        <span key={index}>
          The first team to complete the race will be awarded{" "}
          <b className="text-info">{point}</b> points
        </span>
      );
    } else if (index === points.length - 1) {
      return (
        <span key={index}>
          {" "}
          and the remaining teams <b className="text-info">{point}</b> points
        </span>
      );
    } else {
      return (
        <span key={index}>
          {" "}
          the next team will get <b className="text-info">{point}</b> points
        </span>
      );
    }
  });
  return textParts;
}
export function DelveTabRules() {
  const { scores } = useContext(GlobalStateContext);

  const delveCategory = scores?.children.find(
    (category) => category.name === "Delve",
  );

  const fossilRaceCategory = delveCategory?.children.find(
    (c) => c.name === "Fossil Race",
  );
  const fossilFuelRaceCategory = delveCategory?.children.find(
    (c) => c.name === "Fossil Fuel Race",
  );

  const cumulativeDepthObjective = delveCategory?.children.find(
    (c) => c.tracked_value === TrackedValue.WEIGHTED_DELVE_DEPTH,
  );

  const delveRace = delveCategory?.children.find(
    (c) => c.name === "Delve Race",
  );

  return (
    <>
      {fossilRaceCategory && (
        <>
          <h3>Fossil Race</h3>
          <p>
            The teams race to finish the fossil collection, where the required
            amount of each of the {fossilRaceCategory.children.length} Fossils
            has to be collected.{" "}
            {racePointsToText(
              fossilRaceCategory.scoring_rules[0]?.points || [],
            )}
          </p>
        </>
      )}
      {fossilFuelRaceCategory && (
        <>
          <h3>Fossil Fuel Race</h3>
          <p>
            The teams race to finish the fossil fuel collection, gathering{" "}
            {fossilFuelRaceCategory.required_number} Fossil Fuel.
          </p>
          <ul>
            <li>
              {" "}
              <span className="font-bold">
                Tier 1 Fossils give 10 Fossil Fuel{" "}
              </span>{" "}
              <span>
                (Faceted, Tangled, Bloodstained, Hollow, Fractured, Glyphic)
              </span>
            </li>
            <li>
              <span className="font-bold">
                Tier 2 Fossils give 2 Fossil Fuel
              </span>{" "}
              <span>
                (Bound, Corroded, Opulent, Prismatic, Deft, Lucent, Serrated,
                Shuddering, Fundamental, Aetheric, Gilded and Sanctified){" "}
              </span>
            </li>
            <li>
              <span className="font-bold">
                Tier 3 Fossils give 1 Fossil Fuel{" "}
              </span>
              <span>
                (Jagged, Dense, Frigid, Aberrant, Scorched, Metallic and
                Pristine)
              </span>
            </li>
          </ul>
          <p>
            {racePointsToText(
              fossilFuelRaceCategory.scoring_rules[0]?.points || [],
            )}
          </p>
        </>
      )}
      {cumulativeDepthObjective && (
        <>
          <h3>Cumulative Team Depth</h3>
          <p>
            Total team delve progress is equal to a sum of everyone&apos;s
            individual solo depth progress past 100 depth. Each team is awarded{" "}
            <b className="text-info">1 point per 10</b> total team delve
            progress up to a cap of{" "}
            <b className="text-info">
              {
                cumulativeDepthObjective.scoring_rules?.find(
                  (preset) =>
                    preset.scoring_rule === ScoringRuleType.POINTS_BY_VALUE,
                )?.point_cap
              }
            </b>{" "}
            points.
          </p>
          <p>
            Starting at 150 depth, you get an additional 0.2x multiplier for
            cumulative depth, with every 100 depth after increasing this
            multiplier by an additional 0.2x with a maximum of 2x at 650 depth.
          </p>
        </>
      )}
      {delveRace && (
        <>
          <h3>Delve Race</h3>
          <p>
            Each team selects a member to be their racer. The racer will try to
            delve from depth 300 to depth 600 as fast as possible. The race has
            to be done solo.
          </p>
          <p className="text-warning">
            Usage of "Mageblood" and "The Tides of Time" unique belts is not
            allowed for the submission of the delve race.
          </p>
        </>
      )}
    </>
  );
}
