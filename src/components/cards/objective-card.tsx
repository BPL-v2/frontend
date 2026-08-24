import { ScoreObjective } from "@mytypes/score";
import { CollectionCard } from "@components/cards/collection-card";
import { DailyCard } from "@components/cards/daily-card";
import { ObjectiveType } from "@api";
import { SubmissionCard } from "@components/cards/submission-card";

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
