import {
  conditionsColumn,
  objectiveDetailColumns,
  objectiveIconColumn,
  scoringRuleColumn,
} from "@components/objectives/objective-columns";
import {
  eventIdParams,
  OBJECTIVE_DESIGNER_PERMISSIONS,
} from "@utils/admin-event-route";
import { Objective, ObjectiveType, ObjectiveValidation } from "@api";
import {
  useGetEvents,
  useGetObjectiveValidations,
  useGetRules,
  useGetScoringRulesForEvent,
} from "@api";
import VirtualizedTable from "@components/table/virtualized-table";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { ColumnDef } from "@components/table/react-table-shim";
import { renderConditionally } from "@utils/token";
import { flatMap } from "@utils/utils";
import { useMemo } from "react";

export const Route = createFileRoute(
  "/admin/events/$eventId/unvalidated-objectives",
)({
  component: renderConditionally(
    RouteComponent,
    OBJECTIVE_DESIGNER_PERMISSIONS,
  ),
  params: eventIdParams,
});

function RouteComponent() {
  const { eventId } = useParams({ from: Route.id });
  const { events } = useGetEvents();
  const { scoringRules } = useGetScoringRulesForEvent(eventId);
  const { rules } = useGetRules(eventId);
  const { objectiveValidations } = useGetObjectiveValidations(eventId);
  const event = events?.find((ev) => ev.id === eventId);
  const validationMap = objectiveValidations.reduce(
    (map, validation) => {
      map[validation.objective_id] = validation;
      return map;
    },
    {} as Record<number, ObjectiveValidation>,
  );

  const objectiveColumns: ColumnDef<Objective>[] = useMemo(
    () => [
      objectiveIconColumn(event?.game_version),
      ...objectiveDetailColumns(),
      scoringRuleColumn(scoringRules),
      conditionsColumn(),
    ],
    [scoringRules, event],
  );
  const unvalidatedItems = flatMap(rules).filter(
    (objective) =>
      validationMap[objective.id] === undefined &&
      objective.objective_type === ObjectiveType.ITEM,
  );

  return (
    <VirtualizedTable<Objective>
      className="h-[70vh] w-full"
      columns={objectiveColumns}
      data={unvalidatedItems}
      sortable={false}
    />
  );
}
