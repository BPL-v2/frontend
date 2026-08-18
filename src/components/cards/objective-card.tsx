import { ScoreObjective } from "@mytypes/score";
import { CollectionCard } from "./collection-card";
import { DailyCard } from "./daily-card";
import { ObjectiveType } from "@api";
import { SubmissionCard } from "./submission-card";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  objective: ScoreObjective;
  //   ignoreExtra?: boolean;
  //   showPoints?: boolean;
}

export function ObjectiveCard(props: CardProps) {
  if (props.objective.valid_from) {
    return <DailyCard {...props} />;
  }
  if (props.objective.objective_type === ObjectiveType.SUBMISSION) {
    return <SubmissionCard {...props} />;
  }
  return <CollectionCard {...props} />;
}
