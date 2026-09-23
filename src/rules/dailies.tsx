import { rankedPointsToText } from "./ranked-points-text";
import { ScoringRuleType } from "@api";
import { ScoreObjective } from "@mytypes/score";

const convertArrayToText = (points: number[]) =>
  rankedPointsToText(points, "The first team to complete race dailies", {
    endWithPeriod: true,
  });
export function DailyTabRules({ category }: { category: ScoreObjective }) {
  const basePoints =
    category?.children?.find(
      (objective) =>
        objective.scoring_rules[0]?.scoring_rule ===
        ScoringRuleType.FIXED_POINTS_ON_COMPLETION,
    )?.scoring_rules[0]?.points || [];

  const racePoints =
    category?.children?.find(
      (objective) =>
        objective.scoring_rules[0]?.scoring_rule ===
        ScoringRuleType.RANK_BY_COMPLETION_TIME,
    )?.scoring_rules[0]?.points || [];

  const hoursForCompletion = (
    category?.children?.map(
      (objective) =>
        objective.valid_to!.getTime() - objective.valid_from!.getTime(),
    ) || []
  ).map((ms) => ms / (1000 * 60 * 60));
  return (
    <>
      <h3> Releases </h3>
      <p>
        Dailies are released periodically (see the countdowns). These are
        objectives that require the participation of the entire team.
      </p>
      <h3> Expiry </h3>
      <p>
        After their release, the dailies will be completable for{" "}
        {hoursForCompletion[0]} hours (see countdowns). After that, they will
        grant no more points.
      </p>
      <h3>Points</h3>
      <p>
        {basePoints[0] && (
          <>
            Regular dailies grant <b className="text-info">{basePoints[0]}</b>{" "}
            points on completion.
          </>
        )}
        {convertArrayToText(racePoints)}
      </p>
      <h3 className="text-warning">Notes </h3>
      <p className="text-warning">
        Daily completions are tracked automatically by the system. All items
        that contribute to the completion <b>must</b> be located in the same
        public stash tab - so the progress bar displayed might be misleading.
        Split items do not count.
      </p>
    </>
  );
}
