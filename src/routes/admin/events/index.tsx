import { Event, Permission } from "@api";
import { getObjectiveTreeForEventBase } from "@api";
import {
  useDeleteEvent,
  useDuplicateEvent,
  useGetEvents,
} from "@api";
import { DeleteButton } from "@components/form/delete-button";
import { EventFormModal } from "@components/form-dialogs/EventFormModal";
import VirtualizedTable from "@components/table/virtualized-table";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { renderConditionally } from "@utils/token";
import { useState } from "react";

export const Route = createFileRoute("/admin/events/")({
  component: renderConditionally(EventPage, [
    Permission.admin,
    Permission.objective_designer,
  ]),
});

function EventPage() {
  const { events, isPending, isError } = useGetEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { duplicateEvent } = useDuplicateEvent(queryClient);
  const { deleteEvent } = useDeleteEvent(queryClient);

  const columnDef: ColumnDef<Event>[] = [
    {
      header: "ID",
      accessorKey: "id",
      size: 20,
      enableSorting: false,
    },
    {
      header: "Name",
      accessorKey: "name",
      enableSorting: false,
    },
    {
      header: "Version",
      accessorKey: "game_version",
      enableSorting: false,
      size: 80,
    },
    {
      header: "Dates",
      size: 340,
      cell: (info) => (
        <div className="grid w-full grid-cols-2 gap-0 text-xs">
          <div className="text-left">Application Start: </div>
          <div className="text-right font-mono">
            {new Date(
              info.row.original.application_start_time,
            ).toLocaleString()}
          </div>
          <div className="text-left">Application End: </div>
          <div className="text-right font-mono">
            {new Date(info.row.original.application_end_time).toLocaleString()}
          </div>
          <div className="text-left">Event Start: </div>
          <div className="text-right font-mono">
            {new Date(info.row.original.event_start_time).toLocaleString()}
          </div>
          <div className="text-left">Event End: </div>
          <div className="text-right font-mono">
            {new Date(info.row.original.event_end_time).toLocaleString()}
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      header: "Size",
      accessorKey: "max_size",
      enableSorting: false,
      size: 80,
    },
    {
      header: "Waitlist",
      accessorKey: "waitlist_size",
      enableSorting: false,
      size: 80,
    },
    {
      header: "Current",
      accessorKey: "is_current",
      cell: (info) =>
        info.row.original.is_current ? (
          <CheckCircleIcon className="size-6 text-success" />
        ) : (
          <XCircleIcon className="size-6 text-error" />
        ),
      enableSorting: false,
      size: 80,
    },
    {
      header: "Public",
      accessorKey: "is_public",
      cell: (info) =>
        info.row.original.is_public ? (
          <CheckCircleIcon className="size-6 text-success" />
        ) : (
          <XCircleIcon className="size-6 text-error" />
        ),
      enableSorting: false,
      size: 70,
    },
    {
      header: "Locked",
      accessorKey: "is_locked",
      cell: (info) =>
        info.row.original.is_locked ? (
          <CheckCircleIcon className="size-6 text-success" />
        ) : (
          <XCircleIcon className="size-6 text-error" />
        ),
      enableSorting: false,
      size: 70,
    },
    {
      header: "Actions",
      size: 450,
      cell: (info) => (
        <div className="flex flex-row flex-wrap gap-1">
          <button
            className="btn btn-xs btn-warning"
            onClick={() => {
              setEventToEdit(info.row.original);
              setIsOpen(true);
            }}
          >
            <PencilSquareIcon className="size-6" />
          </button>
          <DeleteButton
            onDelete={() => deleteEvent(info.row.original.id)}
            requireConfirmation
            className="btn-xs"
          />
          <button
            className="btn btn-xs"
            onClick={() =>
              duplicateEvent(
                info.row.original.id,
                {
                  ...info.row.original,
                  id: undefined,
                  name: `${info.row.original.name} (Copy)`,
                  is_current: false,
                  is_public: false,
                  is_locked: false,
                },
              )
            }
          >
            Duplicate
          </button>
          <Link
            to="/admin/events/$eventId/teams"
            params={{ eventId: info.row.original.id }}
            className="btn btn-xs"
          >
            Teams
          </Link>
          <Link
            to="/admin/events/$eventId/scoring-presets"
            params={{ eventId: info.row.original.id }}
            className="btn btn-xs"
          >
            Scoring Presets
          </Link>
          <button
            onClick={() => {
              getObjectiveTreeForEventBase(info.row.original.id)
                .then((baseObjective) => {
                  navigate({
                    to: "/admin/events/$eventId/objectives/$objectiveId",
                    params: {
                      eventId: info.row.original.id,
                      objectiveId: baseObjective.id,
                    },
                  });
                });
            }}
            className="btn btn-xs"
          >
            Objectives
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <EventFormModal
        isOpen={isOpen}
        setIsOpen={(open) => {
          setIsOpen(open);
          if (!open) setEventToEdit(null);
        }}
        existingEvent={eventToEdit}
      />
      <VirtualizedTable
        columns={columnDef}
        data={events?.sort((a, b) => b.id - a.id) ?? []}
      />
      <button
        className="btn self-center btn-success"
        onClick={() => {
          setEventToEdit(null);
          setIsOpen(true);
        }}
      >
        Create new Event
      </button>
    </div>
  );
}

export default EventPage;
