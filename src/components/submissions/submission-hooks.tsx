import { Objective, ObjectiveType } from "@api";
import { iterateObjectives } from "@utils/utils";
import { useMemo } from "react";

/** Submission-type objectives of the rule tree, keyed by id. */
export function useSubmissionObjectiveMap(
  rules: Objective | undefined,
): Record<number, Objective> {
  return useMemo(() => {
    const map: Record<number, Objective> = {};
    iterateObjectives(rules, (objective) => {
      if (objective.objective_type === ObjectiveType.SUBMISSION) {
        map[objective.id] = objective;
      }
    });
    return map;
  }, [rules]);
}

export function SubmissionsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-lg loading-spinner"></span>
        <p className="text-lg">Loading submissions...</p>
      </div>
    </div>
  );
}
