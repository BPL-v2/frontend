import { rankedPointsToText } from "./ranked-points-text";
import { ScoreObjective } from "@mytypes/score";

const convertArrayToText = (points: number[]) =>
  rankedPointsToText(points, "The first team to complete the objective");
export function RaceTabRules({ category }: { category: ScoreObjective }) {
  return (
    <>
      <h2>Points</h2>
      <h3>Boss Races</h3>
      <p>{convertArrayToText([40, 30, 20])}</p>
      <h3>Early Races</h3>
      <p>{convertArrayToText([30, 25, 20])}</p>
      <h3>Endless Chase</h3>
      <p>{convertArrayToText([60, 40, 20])}</p>
      <h3> Submitting a Race</h3>
      <p>
        To submit a completion click on the plus sign icon on the race card and
        fill in the form. You will need to provide a timestamp in your timezone{" "}
        {" (your browser usually provides this for you) "} and a link to a proof
        of your completion. This can for example be a screenshot or a video that
        show your local clock. If there is more information you need to share
        for the reviewers you can add it in the comment field.
      </p>
      <p>
        BPL staff will manually credit points for races after the verification,
        if there are questions about a race condition please confirm with a BPL
        Admin or Manager prior to beginning the map/fight.
      </p>
      <h3 className="text-warning">Notes</h3>
      <p className="text-warning">
        Endless chase races can be submitted multiple times per team. If two
        teams have the same value, the team that submitted first will get more
        points.
      </p>
    </>
  );
}
