import { ScoringRuleType } from "@api";
import { Ranking } from "@components/ranking";
import { ItemTable } from "@components/table/item-table";
import { ScoreObjective } from "@mytypes/score";

interface ScoreCategoryProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: ScoreObjective;
  selectedCategories: Set<number>;
  selectedTeam?: number;
  handleCategoryClick: (objective: ScoreObjective) => void;
}
export function ItemTableScoreCategory({
  category,
  selectedCategories,
  handleCategoryClick,
  selectedTeam,
  ...props
}: ScoreCategoryProps) {
  return (
    <div {...props}>
      <div
        key={category.id}
        className="mt-3 rounded-box bg-base-200 px-0 py-4 sm:px-8 sm:pt-2 sm:pb-8"
      >
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
