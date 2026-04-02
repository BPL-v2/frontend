import { createFileRoute } from "@tanstack/react-router";

import { Permission, ScoringPreset } from "@api";
import {
  useDeleteScoringPreset,
  useGetEvents,
  useGetScoringPresetsForEvent,
} from "@api";
import { ScoringPresetFormModal } from "@components/form-dialogs/ScoringPresetFormModal";
import VirtualizedTable from "@components/table/virtualized-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { renderConditionally } from "@utils/token";
import { useState } from "react";

export const Route = createFileRoute("/admin/events/$eventId/scoring-presets")({
  component: renderConditionally(ScoringPresetsPage, [
    Permission.admin,
    Permission.objective_designer,
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

function ScoringPresetsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [presetToEdit, setPresetToEdit] = useState<ScoringPreset | null>(null);
  const { eventId } = useParams({ from: Route.id });
  const { events } = useGetEvents();
  const event = events?.find((event) => event.id === eventId);
  const { scoringPresets } = useGetScoringPresetsForEvent(eventId);
  const qc = useQueryClient();
  const { deleteScoringPreset } = useDeleteScoringPreset(qc, eventId);

  if (!eventId || !event) {
    return <div>Event not found</div>;
  }

  const presetColumns: ColumnDef<ScoringPreset>[] = [
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
      header: "Scoring Method",
      accessorKey: "scoring_method",
      cell: (info) => info.row.original.scoring_method,
      size: 250,
    },
    {
      header: "Actions",
      cell: (info) => (
        <div className="flex flex-row gap-2">
          <button
            className="btn btn-sm btn-error"
            onClick={() => deleteScoringPreset(info.row.original.id)}
          >
            <TrashIcon className="size-4" />
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => {
              setPresetToEdit(info.row.original);
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

  return (
    <div className="flex flex-col gap-2">
      <h1>{`Scoring Presets for Event "${event.name}"`}</h1>
      <ScoringPresetFormModal
        isOpen={isDialogOpen}
        setIsOpen={(open) => {
          setIsDialogOpen(open);
          if (!open) setPresetToEdit(null);
        }}
        eventId={eventId}
        existingPreset={presetToEdit}
      />
      <button
        className="btn self-center btn-primary"
        onClick={() => {
          setPresetToEdit(null);
          setIsDialogOpen(true);
        }}
      >
        Create Preset
      </button>
      <VirtualizedTable
        columns={presetColumns}
        data={scoringPresets}
        sortable={false}
        className="h-[80vh] w-full"
      />
    </div>
  );
}

export default ScoringPresetsPage;
