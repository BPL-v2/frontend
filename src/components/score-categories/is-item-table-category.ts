import { ObjectiveType, TrackedValue } from "@api";
import { ScoreObjective } from "@mytypes/score";

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
