import { ScoringRuleType } from "@api";
import { Ranking } from "@components/ranking";
import { ItemTable } from "@components/table/item-table";
import TeamScoreDisplay from "@components/team/team-score";
import { ScoreObjective } from "@mytypes/score";

interface ScoreCategoryProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: ScoreObjective;
}
export function ItemTableScoreCategory({
  category,
  ...props
}: ScoreCategoryProps) {
  return (
    <div {...props}>
      <TeamScoreDisplay objective={category} />
      <div key={category.id} className="rounded-box bg-base-200 p-8 pt-2">
        <div className="divider divider-primary">{category.name}</div>
        {(category.scoring_rules[0]?.scoring_rule ===
          ScoringRuleType.RANK_BY_COMPLETION_TIME ||
          category.scoring_rules[0]?.scoring_rule ===
            ScoringRuleType.RANK_BY_CHILD_COMPLETION_TIME) && (
          <Ranking
            objective={category}
            maximum={category.children.length}
            actual={(teamId: number) =>
              category.children.filter((o) => o.team_score[teamId].isFinished())
                .length
            }
            description={"Items:"}
          />
        )}
        <div className="flex flex-col">
          <ItemTable
            objective={category}
            styles={{
              header: "bg-base-100",
            }}
          />
        </div>
      </div>
    </div>
  );
}
