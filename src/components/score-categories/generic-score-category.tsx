import { ObjectiveType, TrackedValue } from "@api";
import { ScoreObjective } from "@mytypes/score";
import { ItemTableScoreCategory } from "./item-table-category";
import SubmissionTab from "@components/submission-tab";

interface ScoreCategoryProps extends React.HTMLAttributes<HTMLSpanElement> {
  category?: ScoreObjective;
}

function isItemTableCategory(category: ScoreObjective): boolean {
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
    return <SubmissionTab category={category} {...props} />;
  }
  return <div {...props}>{category.name}</div>;
}
