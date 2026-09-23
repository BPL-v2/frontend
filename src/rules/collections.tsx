import { rankedPointsToText } from "./ranked-points-text";
import { ScoreObjective } from "@mytypes/score";

const convertArrayToText = (points: number[]) =>
  rankedPointsToText(points, "The first team to complete the collection");
export function CollectionTabRules({ category }: { category: ScoreObjective }) {
  const racePoints = category?.children[0]?.scoring_rules[0]?.points || [];

  return (
    <>
      <h3>Points</h3>
      <p>
        Completing a collection goal awards points to the team depending on the
        time of completion. {convertArrayToText(racePoints)}
      </p>
      <h3 className="text-warning">Notes </h3>
      <p className="text-warning">
        Collection completions are tracked automatically by the system. All
        items that contribute to the completion <b>must</b> be located in the
        same public stash tab - so the progress bar displayed might be
        misleading. Split items do not count.
      </p>
    </>
  );
}
