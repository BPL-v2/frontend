import { JSX } from "react";
import { ScoreObjective } from "@mytypes/score";

function convertArrayToText(points: number[]): JSX.Element[] {
  const textParts = points.map((point, index) => {
    if (index === 0) {
      return (
        <span key={index}>
          The first team to complete the objective will be awarded{" "}
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
export function AtlasRaceTabRules({ category }: { category: ScoreObjective }) {
  const points = category?.scoring_rules[0]?.points || [];
  return (
    <>
      <h3>Points</h3>
      <p>
        Every team tries to complete get as many{" "}
        <b className="">Name in Lights</b> (First to enter area on Server) as
        Possible. Every Name in Lights will be awarded{" "}
        <b className="text-info">{1}</b> point.
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
      <h3 className="text-warning">Notes</h3>
      <p className="text-warning">
        Endless chase races can be submitted multiple times per team. If two
        teams have the same value, the team that submitted first will get more
        points.
      </p>
    </>
  );
}
