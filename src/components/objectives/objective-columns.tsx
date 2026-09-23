import { Condition, GameVersion, Objective, ScoringRule } from "@api";
import { ObjectiveIcon } from "@components/objective-icon";
import { ColumnDef } from "@components/table/react-table-shim";
import { XCircleIcon } from "@heroicons/react/24/outline";

type ObjectiveColumn = ColumnDef<Objective>;

export function objectiveIconColumn(
  gameVersion?: GameVersion,
): ObjectiveColumn {
  return {
    header: "",
    accessorKey: "id",
    cell: ({ row }) => (
      <ObjectiveIcon
        objective={row.original}
        gameVersion={gameVersion ?? GameVersion.poe1}
      />
    ),
    size: 80,
  };
}

/** Name, extra, required number, type and counting method. */
export function objectiveDetailColumns(): ObjectiveColumn[] {
  return [
    { header: "Name", accessorKey: "name", size: 200 },
    { header: "Extra", accessorKey: "extra", size: 190 },
    { header: "Num", accessorKey: "required_number", size: 50 },
    { header: "Type", accessorKey: "objective_type", size: 100 },
    { header: "Counting Method", accessorKey: "counting_method", size: 180 },
  ];
}

export function scoringRuleColumn(
  scoringRules: ScoringRule[],
): ObjectiveColumn {
  return {
    header: "Scoring Rule",
    cell: ({ row }) =>
      scoringRules
        .filter((rule) =>
          row.original.scoring_rules.map((r) => r.id).includes(rule.id),
        )
        .map((rule) => rule.name)
        .join(", "),
  };
}

/** Condition badges; pass `onRemoveCondition` to make them removable. */
export function conditionsColumn(
  onRemoveCondition?: (objective: Objective, condition: Condition) => void,
): ObjectiveColumn {
  return {
    header: "Conditions",
    accessorKey: "conditions",
    size: 150,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.conditions.map((condition) => (
          <div
            className="tooltip"
            key={
              "condition-" +
              condition.field +
              "-" +
              condition.operator +
              "-" +
              condition.value
            }
          >
            <span className="tooltip-content flex flex-row items-center gap-1">
              <span className="text-success">{condition.field}</span>
              <span className="text-info">{condition.operator}</span>
              <span className="text-error">{condition.value}</span>
            </span>
            <div className="badge pr-px badge-sm whitespace-nowrap badge-primary select-none">
              {condition.field}
              {onRemoveCondition && (
                <XCircleIcon
                  className="size-4 cursor-pointer"
                  onClick={() => onRemoveCondition(row.original, condition)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    ),
  };
}
