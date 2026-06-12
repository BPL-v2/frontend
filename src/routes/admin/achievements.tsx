import { Permission, AchievementResponse } from "@api";
import {
  useGetAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { DeleteButton } from "@components/form/delete-button";
import VirtualizedTable from "@components/table/virtualized-table";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { renderConditionally } from "@utils/token";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/achievements")({
  component: renderConditionally(AchievementsPage, [Permission.admin]),
});

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

  const form = useAppForm({
    defaultValues: { name: "", description: "" },
    onSubmit: (data) => {
      if (existing?.id) {
        updateAchievement(existing.id, data.value);
      } else {
        createAchievement(data.value);
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
      setFormValues(form, { name: existing.name ?? "", description: existing.description ?? "" });
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

function AchievementsPage() {
  const { achievements, isPending, isError } = useGetAchievements();
  const [isOpen, setIsOpen] = useState(false);
  const [toEdit, setToEdit] = useState<AchievementResponse | null>(null);
  const qc = useQueryClient();
  const { deleteAchievement } = useDeleteAchievement(qc);

  const columns: ColumnDef<AchievementResponse>[] = [
    {
      header: "ID",
      accessorKey: "id",
      size: 60,
      enableSorting: false,
    },
    {
      header: "Name",
      accessorKey: "name",
      enableSorting: false,
    },
    {
      header: "Description",
      accessorKey: "description",
      enableSorting: false,
    },
    {
      header: "Custom",
      accessorKey: "is_custom",
      size: 80,
      enableSorting: false,
      cell: (info) => (info.row.original.is_custom ? "Yes" : "No"),
    },
    {
      header: "Actions",
      size: 120,
      enableSorting: false,
      cell: (info) =>
        info.row.original.is_custom ? (
          <div className="flex gap-1">
            <button
              className="btn btn-xs btn-warning"
              onClick={() => {
                setToEdit(info.row.original);
                setIsOpen(true);
              }}
            >
              <PencilSquareIcon className="size-4" />
            </button>
            <DeleteButton
              onDelete={() => deleteAchievement(info.row.original.id!)}
              requireConfirmation
              className="btn-xs"
            />
          </div>
        ) : null,
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
      <VirtualizedTable
        columns={columns}
        data={achievements}
        className="h-[70vh]"
      />
      <button
        className="btn btn-success self-center"
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
