import {
  eventIdParams,
  OBJECTIVE_DESIGNER_PERMISSIONS,
} from "@utils/admin-event-route";
import { Team } from "@api";
import {
  useDeleteTeam,
  useDeleteTeamIcon,
  useGetEvents,
  useUploadTeamIcon,
} from "@api";
import { TeamFormModal } from "@components/form-dialogs/TeamFormModal";
import VirtualizedTable from "@components/table/virtualized-table";
import {
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { ColumnDef } from "@components/table/react-table-shim";
import { renderConditionally } from "@utils/token";
import { useRef, useState } from "react";

export const Route = createFileRoute("/admin/events/$eventId/teams")({
  component: renderConditionally(TeamPage, OBJECTIVE_DESIGNER_PERMISSIONS),

  params: eventIdParams,
});

function TeamIconButtons({ team, eventId }: { team: Team; eventId: number }) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadIcon, uploadIconPending } = useUploadTeamIcon(qc, eventId);
  const { deleteIcon, deleteIconPending } = useDeleteTeamIcon(qc, eventId);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadIcon(team.id, file);
          e.target.value = "";
        }}
      />
      <div className="tooltip tooltip-info" data-tip="Upload icon">
        <button
          className="btn btn-info btn-sm"
          disabled={uploadIconPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadIconPending ? (
            <span className="loading loading-xs loading-spinner" />
          ) : (
            <PhotoIcon className="size-4" />
          )}
        </button>
      </div>
      {team.icon_url && (
        <div className="tooltip tooltip-warning" data-tip="Remove icon">
          <button
            className="btn btn-sm btn-warning"
            disabled={deleteIconPending}
            onClick={() => deleteIcon(team.id)}
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      )}
    </>
  );
}

function TeamPage() {
  const { eventId } = useParams({ from: Route.id });
  const { events, isPending, isError } = useGetEvents();
  const event = events?.find((event) => event.id === eventId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);
  const qc = useQueryClient();
  const { deleteTeam } = useDeleteTeam(qc, eventId);

  const columns: ColumnDef<Team>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Icon",
      enableSorting: false,
      cell: (info) =>
        info.row.original.icon_url ? (
          <img
            src={info.row.original.icon_url}
            alt=""
            className="size-8 object-contain"
          />
        ) : null,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Abbreviation",
      accessorKey: "abbreviation",
      cell: (info) =>
        info.row.original.abbreviation ||
        info.row.original.name.slice(0, 3).toUpperCase(),
      size: 200,
    },
    {
      header: "Color",
      accessorKey: "color",
      cell: (info) => (
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: info.row.original.color }}
        />
      ),
    },
    {
      header: "Allowed Classes",
      accessorKey: "allowed_classes",
      cell: (info) => info.row.original.allowed_classes.join(", "),
      size: 300,
    },
    {
      header: "Discord Role ID",
      accessorKey: "discord_role_id",
      cell: (info) => info.row.original.discord_role_id,
      size: 300,
    },
    {
      header: "Actions",
      cell: (info) => (
        <div className="flex flex-row gap-2">
          <button
            className="btn btn-error btn-sm"
            onClick={() => deleteTeam(info.row.original.id)}
          >
            <TrashIcon className="size-4" />
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => {
              setTeamToEdit(info.row.original);
              setIsDialogOpen(true);
            }}
          >
            <PencilSquareIcon className="size-4" />
          </button>
          <TeamIconButtons team={info.row.original} eventId={eventId} />
        </div>
      ),
    },
  ];

  if (isPending) {
    return <div className="loading loading-lg loading-spinner" />;
  }
  if (isError) {
    return <div>Error loading events.</div>;
  }
  if (!event || !eventId) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2">
      <VirtualizedTable
        columns={columns}
        data={event.teams.sort((a, b) => a.id - b.id)}
      />
      <button
        className="btn self-center btn-primary"
        onClick={() => {
          setTeamToEdit(null);
          setIsDialogOpen(true);
        }}
      >
        Create Team
      </button>
      <TeamFormModal
        isOpen={isDialogOpen}
        setIsOpen={(open) => {
          setIsDialogOpen(open);
          if (!open) setTeamToEdit(null);
        }}
        eventId={eventId}
        gameVersion={event.game_version}
        existingTeam={teamToEdit}
      />
    </div>
  );
}

export default TeamPage;
