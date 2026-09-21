import { Permission, AchievementResponse, AchievementCheckKey } from "@api";
import {
  useGetAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
  useUploadAchievementIcon,
  useDeleteAchievementIcon,
  useGetUserAchievements,
  useGetEvents,
} from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { DeleteButton } from "@components/form/delete-button";
import Table from "@components/table/table";
import {
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { renderConditionally } from "@utils/token";
import { ColumnDef } from "@components/table/react-table-shim";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/admin/achievements/")({
  component: renderConditionally(AchievementsPage, [
    Permission.admin,
    Permission.objective_designer,
  ]),
});

const autoCheckKeyLabels: Record<AchievementCheckKey, string> = {
  level_90: "Reached level 90",
  level_95: "Reached level 95",
  level_100: "Reached level 100",
  participated_in_event: "Participated in an event",
  played_5_leagues: "Played 5 leagues",
  played_10_leagues: "Played 10 leagues",
  played_5_ascendancies: "Played 5 different ascendancies",
  played_10_ascendancies: "Played 10 different ascendancies",
  teamlead: "Teamlead",
  submitted_bounty: "Submitted a bounty",
};


interface AchievementFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  existing?: AchievementResponse | null;
}

function AchievementFormModal({
  isOpen,
  setIsOpen,
  existing,
}: AchievementFormModalProps) {
  const qc = useQueryClient();
  const { events } = useGetEvents();
  const eventOptions = events.map((event) => ({
    label: event.name,
    value: event.id,
  }));

  const form = useAppForm({
    defaultValues: { name: "", description: "", event_id: null as number | null },
    onSubmit: (data) => {
      const values = { ...data.value, event_id: data.value.event_id ?? undefined };
      if (existing?.id) {
        updateAchievement(existing.id, values);
      } else {
        createAchievement(values);
      }
    },
  });

  const { createAchievement } = useCreateAchievement(qc, () => {
    setIsOpen(false);
    form.reset();
  });

  const { updateAchievement } = useUpdateAchievement(qc, () => {
    setIsOpen(false);
    form.reset();
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    if (existing) {
      setFormValues(form, {
        name: existing.name ?? "",
        description: existing.description ?? "",
        event_id: existing.event_id ?? null,
      });
    }
  }, [isOpen, existing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog
      setOpen={setIsOpen}
      open={isOpen}
      title={existing ? "Edit Achievement" : "Create Achievement"}
      className="max-w-md"
    >
      <form
        className="flex w-full flex-col gap-2 rounded-box bg-base-300 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Name" />}
        />
        <form.AppField
          name="description"
          children={(field) => <field.TextField label="Description" />}
        />
        <form.AppField
          name="event_id"
          children={(field) => (
            <field.SelectField
              label="Event"
              options={eventOptions}
              helperText="Scopes this achievement to one season - leave empty for an always-obtainable achievement."
            />
          )}
        />
        <div className="mt-4 flex flex-row justify-end gap-4">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function IconUploadButton({
  achievement,
}: {
  achievement: AchievementResponse;
}) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadIcon, uploadIconPending } = useUploadAchievementIcon(qc);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadIcon(achievement.id!, file);
          e.target.value = "";
        }}
      />
      <button
        className="btn btn-xs btn-info"
        disabled={uploadIconPending}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadIconPending ? (
          <span className="loading loading-xs loading-spinner" />
        ) : (
          <PhotoIcon className="size-4" />
        )}
      </button>
    </>
  );
}

function IconDeleteButton({
  achievement,
}: {
  achievement: AchievementResponse;
}) {
  const qc = useQueryClient();
  const { deleteIcon, deleteIconPending } = useDeleteAchievementIcon(qc);

  if (!achievement.icon_url) return null;

  return (
    <button
      className="btn btn-xs btn-warning"
      disabled={deleteIconPending}
      onClick={() => deleteIcon(achievement.id!)}
    >
      {deleteIconPending ? (
        <span className="loading loading-xs loading-spinner" />
      ) : (
        <TrashIcon className="size-4" />
      )}
    </button>
  );
}

function AchievementsPage() {
  const { achievements, isPending, isError } = useGetAchievements();
  const { userAchievements } = useGetUserAchievements();
  const { events } = useGetEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [toEdit, setToEdit] = useState<AchievementResponse | null>(null);
  const qc = useQueryClient();
  const { deleteAchievement } = useDeleteAchievement(qc);

  const playerCountById = useMemo(() => {
    const counts: Record<number, number> = {};
    userAchievements.forEach((ua) => {
      if (ua.achievement_id === undefined) return;
      counts[ua.achievement_id] = (counts[ua.achievement_id] ?? 0) + 1;
    });
    return counts;
  }, [userAchievements]);

  const columns: ColumnDef<AchievementResponse>[] = [
    {
      header: "Icon",
      enableSorting: false,
      cell: (info) => {
        const url = info.row.original.icon_url;
        return url ? (
          <img src={url} alt="" className="size-8 object-contain" />
        ) : null;
      },
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Custom",
      accessorKey: "is_custom",
      cell: (info) => (info.row.original.is_custom ? "Yes" : "No"),
    },
    {
      header: "Auto-check",
      accessorKey: "auto_check_key",
      cell: (info) => {
        const key = info.row.original.auto_check_key;
        return key ? (autoCheckKeyLabels[key] ?? key) : "Manual";
      },
    },
    {
      header: "Event",
      id: "event",
      cell: (info) => {
        const eventId = info.row.original.event_id;
        if (!eventId) return "Any";
        return events.find((e) => e.id === eventId)?.name ?? `Event #${eventId}`;
      },
    },
    {
      header: "Players",
      id: "players",
      cell: (info) => (
        <Link
          to="/admin/achievements/$achievementId"
          params={{ achievementId: info.row.original.id! }}
          className="underline hover:text-primary"
        >
          {playerCountById[info.row.original.id!] ?? 0}
        </Link>
      ),
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: (info) => (
        <div className="flex gap-1">
          <div className="tooltip" data-tip="Edit">
            <button
              className="btn btn-xs btn-warning"
              onClick={() => {
                setToEdit(info.row.original);
                setIsOpen(true);
              }}
            >
              <PencilSquareIcon className="size-4" />
            </button>
          </div>
          <div className="tooltip tooltip-info" data-tip="Upload icon">
            <IconUploadButton achievement={info.row.original} />
          </div>
          <div className="tooltip tooltip-warning" data-tip="Remove icon">
            <IconDeleteButton achievement={info.row.original} />
          </div>
          <DeleteButton
            onDelete={() => deleteAchievement(info.row.original.id!)}
            requireConfirmation
            className="btn-xs"
          />
        </div>
      ),
    },
  ];

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading achievements</div>;

  return (
    <div className="mt-4 flex flex-col gap-4">
      <AchievementFormModal
        isOpen={isOpen}
        setIsOpen={(open) => {
          setIsOpen(open);
          if (!open) setToEdit(null);
        }}
        existing={toEdit}
      />
      <Table columns={columns} data={achievements} />
      <button
        className="btn self-center btn-success"
        onClick={() => {
          setToEdit(null);
          setIsOpen(true);
        }}
      >
        Create Achievement
      </button>
    </div>
  );
}

export default AchievementsPage;
