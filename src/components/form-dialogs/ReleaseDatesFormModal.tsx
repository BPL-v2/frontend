import { useEffect } from "react";
import { Objective } from "@api";
import { Dialog } from "@components/dialog";
import { useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useChangeCategoryReleaseDates } from "@api";

interface ReleaseDatesFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  objective: Objective;
}

export function ReleaseDatesFormModal({
  isOpen,
  setIsOpen,
  eventId,
  objective,
}: ReleaseDatesFormModalProps) {
  const qc = useQueryClient();
  const { changeCategoryReleaseDates, changeCategoryReleaseDatesPending } =
    useChangeCategoryReleaseDates(qc, eventId);

  const form = useAppForm({
    defaultValues: {
      valid_from: objective.valid_from ?? "",
      valid_to: objective.valid_to ?? "",
    },
    onSubmit: (data) => {
      changeCategoryReleaseDates({
        objective,
        start: data.value.valid_from ? new Date(data.value.valid_from) : null,
        end: data.value.valid_to ? new Date(data.value.valid_to) : null,
      });
      setIsOpen(false);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    form.setFieldValue("valid_from", objective.valid_from ?? "");
    form.setFieldValue("valid_to", objective.valid_to ?? "");
  }, [isOpen, objective]);

  return (
    <Dialog
      title={`Release Dates: ${objective.name}`}
      open={isOpen}
      setOpen={setIsOpen}
      className="max-w-lg"
    >
      <form
        className="flex w-full flex-col gap-2 rounded-box bg-base-300 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="valid_from"
          children={(field: any) => <field.DateTimeField label="Valid From" />}
        />
        <form.AppField
          name="valid_to"
          children={(field: any) => <field.DateTimeField label="Valid To" />}
        />
        <div className="mt-4 flex flex-row justify-end gap-2">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={changeCategoryReleaseDatesPending}
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}
