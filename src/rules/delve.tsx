import { JSX, useContext } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { TrackedValue, ScoringRuleType } from "@api";

function racePointsToText(points: number[], name: string): JSX.Element[] {
  const textParts = points.map((point, index) => {
    if (index === 0) {
      return (
        <span key={index}>
          The fastest team to complete {name} will be awarded{" "}
          <b className="text-info">{point}</b> points.
        </span>
      );
    } else if (index === points.length - 1) {
      return (
        <span key={index}>
          ,{" "}
          and the rest will get <b className="text-info">{point}</b> points
        </span>
      );
    } else {
      return (
        <span key={index}>
          {" "}
          The next team will get <b className="text-info">{point}</b> points
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

  const cumulativeDepthObjectivePointsPresent =
    cumulativeDepthObjective?.scoring_rules.find(
      (preset) => preset.scoring_rule === ScoringRuleType.POINTS_BY_VALUE,
    );
  const cumulativeDepthObjectivePointsRace =
    cumulativeDepthObjective?.scoring_rules.find(
      (preset) =>
        preset.scoring_rule === ScoringRuleType.RANK_BY_COMPLETION_TIME,
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
              "the Fossil Race",
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
              "the Fossil Fuel Race",
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
              {cumulativeDepthObjectivePointsPresent?.point_cap}
            </b>{" "}
            points.
          </p>
          <p>
            Starting at 150 depth, you get an additional 0.2x multiplier for
            cumulative depth, with every 100 depth after increasing this
            multiplier by an additional 0.2x with a maximum of 2x at 650 depth.
          </p>
          <p>
            Past {cumulativeDepthObjectivePointsPresent?.point_cap} points,
            teams will be awarded <b className="text-info">10 points per 500</b>{" "}
            total team delve until the maximum of{" "}
            <b className="text-info">50 points</b> is reached at <b>10000</b>{" "}
            total team delve progress.
          </p>
          {cumulativeDepthObjectivePointsRace && (
            <p>
              {racePointsToText(
                cumulativeDepthObjectivePointsRace.points,
                "7500 Depth",
              )}
            </p>
          )}
        </>
      )}
      {delveRace && (
        <>
          <h3>Delve Race</h3>
          <ul>
            <li>300-350, average time taken across 4 team members</li>
            <li>Completed within the first 48 hours of the event</li>
            <li>3% average time reduction per unique submission</li>
            <li>(Ascendancy + Main Skill + Movement Skill all different)</li>
            <li>
              {racePointsToText(
                delveRace.scoring_rules[0]?.points || [],
                "the Delve Race",
              )}
            </li>
          </ul>
        </>
      )}
    </>
  );
}
