import { createFileRoute, Link } from "@tanstack/react-router";

import { Permission, ScoringRule, useGetRules } from "@api";
import {
  useDeleteScoringRule,
  useGetEvents,
  useGetScoringRulesForEvent,
} from "@api";
import { ScoringRuleFormModal } from "@components/form-dialogs/ScoringPresetFormModal";
import VirtualizedTable from "@components/table/virtualized-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ColumnDef } from "@components/table/react-table-shim";
import { renderConditionally } from "@utils/token";
import { useState } from "react";
import { flatMap } from "@utils/utils";

export const Route = createFileRoute("/admin/events/$eventId/scoring-rules")({
  component: renderConditionally(ScoringRulesPage, [
    Permission.admin,
    Permission.objective_designer,
    Permission.manager,
  ]),

  params: {
    parse: (params) => ({
      eventId: Number(params.eventId),
    }),
    stringify: (params) => ({
      eventId: params.eventId.toString(),
    }),
  },
});

function pointsRenderer(points: number[]) {
  if (points.length === 1) {
    return points[0];
  }
  const val2Count = new Map<number, number>();
  points.forEach((val) => {
    val2Count.set(val, (val2Count.get(val) || 0) + 1);
  });
  let out = "[";
  for (const [val, count] of val2Count.entries()) {
    if (count === 1) {
      out += `${val}, `;
    } else {
      out += `${val}x${count}, `;
    }
  }
  return out.slice(0, -2) + "]";
}

function ScoringRulesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<ScoringRule | null>(null);
  const { eventId } = useParams({ from: Route.id });
  const { events } = useGetEvents();
  const event = events?.find((event) => event.id === eventId);
  const { scoringRules } = useGetScoringRulesForEvent(eventId);
  const { rules } = useGetRules(eventId);
  const qc = useQueryClient();
  const { deleteScoringRule } = useDeleteScoringRule(qc, eventId);

  if (!eventId || !event) {
    return <div>Event not found</div>;
  }

  const presetColumns: ColumnDef<ScoringRule>[] = [
    {
      header: "ID",
      accessorKey: "id",
      size: 50,
    },
    {
      header: "Name",
      accessorKey: "name",
      size: 400,
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 400,
    },
    {
      header: "Points",
      accessorKey: "points",
      cell: (info) => pointsRenderer(info.row.original.points),
      size: 150,
    },
    {
      header: "Cap",
      accessorKey: "point_cap",
      cell: (info) =>
        info.row.original.point_cap ? info.row.original.point_cap : "",
      size: 50,
    },
    {
      header: "Scoring Rule",
      accessorKey: "scoring_rule",
      cell: (info) => info.row.original.scoring_rule,
      size: 280,
    },
    {
      header: "Actions",
      cell: (info) => (
        <div className="flex flex-row gap-2">
          <button
            className="btn btn-error btn-sm"
            onClick={() => deleteScoringRule(info.row.original.id)}
          >
            <TrashIcon className="size-4" />
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => {
              setRuleToEdit(info.row.original);
              setIsDialogOpen(true);
            }}
          >
            <PencilSquareIcon className="size-4" />
          </button>
        </div>
      ),
      size: 100,
    },
  ];
  const usedScoringRules = new Set(
    flatMap(rules)
      .map((objective) => objective.scoring_rules.map((rule) => rule.id))
      .flat(),
  );
  console.log(rules);
  console.log("usedScoringRules", usedScoringRules);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1>{`Scoring Rules for Event "${event.name}"`}</h1>
        <Link
          to="/admin/events/$eventId/objective-help"
          params={{ eventId }}
          className="btn btn-accent"
        >
          Objective Help
        </Link>
      </div>
      <ScoringRuleFormModal
        isOpen={isDialogOpen}
        setIsOpen={(open: boolean) => {
          setIsDialogOpen(open);
          if (!open) setRuleToEdit(null);
        }}
        eventId={eventId}
        existingRule={ruleToEdit}
      />
      <button
        className="btn self-center btn-primary"
        onClick={() => {
          setRuleToEdit(null);
          setIsDialogOpen(true);
        }}
      >
        Create Scoring Rule
      </button>
      <VirtualizedTable
        columns={presetColumns}
        data={scoringRules}
        sortable={false}
        className="h-[80vh] w-full"
        rowClassName={(row) =>
          usedScoringRules.has(row.original.id)
            ? "bg-base-300"
            : "bg-red-500/20"
        }
      />
    </div>
  );
}

export default ScoringRulesPage;
