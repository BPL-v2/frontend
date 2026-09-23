import { rankedPointsToText } from "./ranked-points-text";
import { ScoreObjective } from "@mytypes/score";

const convertArrayToText = (points: number[]) =>
  rankedPointsToText(points, "The team with the most Names in Light");
export function AtlasRaceTabRules({ category }: { category: ScoreObjective }) {
  const points = category?.scoring_rules[0]?.points || [];
  return (
    <>
      <h3>Points</h3>
      <p>
        Every team tries to complete get as many{" "}
        <b className="">Name in Lights</b> (First to enter area on Server) as
        Possible.
      </p>
      <p>{convertArrayToText(points)}</p>
      <h3>Submitting a Name in Light</h3>
      <p>
        To submit a completion click on the plus sign icon on the table row and
        fill in the form. You will need to provide a link to a proof of your
        completion. This can for example be a screenshot of the Name in Lights.
        If there is more information you need to share for the reviewers you can
        add it in the comment field.
      </p>
      <p>
        BPL staff will manually credit points for races after the verification,
        if there are questions about a race condition please confirm with a BPL
        Admin or Manager prior to beginning the map/fight.
      </p>
    </>
  );
}
