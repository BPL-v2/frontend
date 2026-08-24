import { ObjectiveType, TrackedValue } from "@api";
import { ScoreObjective } from "@mytypes/score";
import { ItemTableScoreCategory } from "@components/score-categories/item-table-category";
import { CategoryOfItemTableCategories } from "@components/score-categories/category-of-item-table-categories";
import { ObjectiveCard } from "@components/cards/objective-card";
import { twMerge } from "tailwind-merge";
import { SubmissionTable } from "@components/table/submission-table";

interface ScoreCategoryProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: ScoreObjective;
  selectedCategories: Set<number>;
  selectedTeam?: number;
  handleCategoryClick: (objective: ScoreObjective) => void;
}

export function isItemTableCategory(category: ScoreObjective): boolean {
  return (
    category.tracked_value === TrackedValue.COMPLETED_CHILD_OBJECTIVE_COUNT &&
    category.children.length > 0 &&
    category.children.every(
      (child) =>
        child.objective_type === ObjectiveType.ITEM &&
        child.required_number === 1,
    )
  );
}

function isSubmittableCategory(category: ScoreObjective): boolean {
  return (
    category.tracked_value === TrackedValue.COMPLETED_CHILD_OBJECTIVE_COUNT &&
    category.children.length > 0 &&
    category.children.every(
      (child) =>
        child.objective_type === ObjectiveType.SUBMISSION &&
        child.required_number === 1,
    )
  );
}

function isGridCategory(category: ScoreObjective): boolean {
  return (
    category.children.length > 0 &&
    category.children.every((c) => c.children.length == 0)
  );
}

export function GenericScoreCategory({
  category,
  ...props
}: ScoreCategoryProps) {
  if (!category) {
    return <></>;
  }
  if (isItemTableCategory(category)) {
    return <ItemTableScoreCategory category={category} {...props} />;
  }
  if (isSubmittableCategory(category)) {
    if (category.children.length > 30) {
      return <SubmissionTable objective={category} />;
    }
  }
  if (isGridCategory(category)) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.children
          .sort((objA: ScoreObjective, objB: ScoreObjective) => {
            const releaseA = objA.valid_from
              ? new Date(objA.valid_from)
              : new Date();
            const releaseB = objB.valid_from
              ? new Date(objB.valid_from)
              : new Date();
            return releaseA.getTime() - releaseB.getTime();
          })
          .map((objective) => (
            <ObjectiveCard key={objective.id} objective={objective} />
          ))}
      </div>
    );
  }
  if (category.children.length === 0) {
    return <ObjectiveCard key={category.id} objective={category} />;
  }
  const childmap = [];

  childmap.push(
    <div
      className="flex w-full flex-row justify-center gap-4 rounded-box bg-base-200 p-4"
      key={category.id + "-children"}
    >
      {category.children
        .filter((c) => !isItemTableCategory(c))
        .map((c) => (
          <GenericScoreCategory key={c.id} category={c} {...props} />
        ))}
    </div>,
  );
  if (category.children.filter(isItemTableCategory).length > 1) {
    childmap.push(
      <CategoryOfItemTableCategories
        key={category.id + "-itemtable"}
        category={category}
        {...props}
      />,
    );
  }
  return (
    <div className={twMerge(props.className, "justify-end")}>
      <div className="flex flex-col gap-4">{childmap}</div>
    </div>
  );
}
