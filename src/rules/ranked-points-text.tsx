import { JSX, ReactNode } from "react";

/**
 * Renders a descending list of placement points as prose, e.g.
 * "<first> will be awarded 40 points the next team will get 30 points and the
 * remaining teams 20 points".
 */
export function rankedPointsToText(
  points: number[],
  first: ReactNode,
  { endWithPeriod = false }: { endWithPeriod?: boolean } = {},
): JSX.Element[] {
  return points.map((point, index) => {
    if (index === 0) {
      return (
        <span key={index}>
          {first} will be awarded <b className="text-info">{point}</b> points
        </span>
      );
    }
    if (index === points.length - 1) {
      return (
        <span key={index}>
          {" "}
          and the remaining teams <b className="text-info">{point}</b> points
          {endWithPeriod && "."}
        </span>
      );
    }
    return (
      <span key={index}>
        {" "}
        the next team will get <b className="text-info">{point}</b> points
      </span>
    );
  });
}
