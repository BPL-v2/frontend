import { SubmissionTable } from "@components/table/submission-table";
import TeamScoreDisplay from "@components/team/team-score";
import { ScoreObjective } from "@mytypes/score";

interface ScoreCategoryProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: ScoreObjective;
}
export function SubmissionTableScoreCategory({
  category,
  ...props
}: ScoreCategoryProps) {
  return (
    <div {...props}>
      <div className="flex flex-col gap-4">
        <TeamScoreDisplay objective={category} />
        <SubmissionTable objective={category} />
      </div>{" "}
    </div>
  );
}
