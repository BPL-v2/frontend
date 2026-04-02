import { AggregationType, ItemField } from "@client/api";
import { Dialog } from "@components/dialog";
import { useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateBulkObjectives,
  useGetScoringPresetsForEvent,
} from "@client/query";

export type BulkObjectiveCreate = {
  nameList: string;
  scoring_preset_ids: number[];
  aggregation_method: AggregationType;
  item_field: ItemField;
};

interface BulkObjectiveFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  categoryId: number;
}

export function BulkObjectiveFormModal({
  isOpen,
  setIsOpen,
  eventId,
  categoryId,
}: BulkObjectiveFormModalProps) {
  const qc = useQueryClient();
  const { scoringPresets } = useGetScoringPresetsForEvent(eventId);

  const form = useAppForm({
    defaultValues: {} as BulkObjectiveCreate,
    onSubmit: (data) => createBulkObjectives(data.value),
  });

  const { createBulkObjectives } = useCreateBulkObjectives(
    qc,
    eventId,
    categoryId,
    () => {
      setIsOpen(false);
      form.reset();
    },
  );

  return (
    <Dialog
      title="Create Objectives in bulk"
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
          name="nameList"
          children={(field: any) => (
            <field.TextField
              label="Name List (Comma separated)"
              required
              placeholder="Item1, Item2, Item3"
            />
          )}
        />
        <form.AppField
          name="scoring_preset_ids"
          children={(field: any) => (
            <field.MultiSelectField
              label="Scoring Presets"
              className="w-full"
              options={scoringPresets.map((preset) => ({
                label: preset.name,
                value: preset.id,
              }))}
            />
          )}
        />
        <form.AppField
          name="aggregation_method"
          children={(field: any) => (
            <field.SelectField
              label="Aggregation Method"
              className="w-full"
              required
              options={Object.values(AggregationType)}
            />
          )}
        />
        <form.AppField
          name="item_field"
          children={(field: any) => (
            <field.SelectField
              label="Item Field"
              className="w-full"
              required
              options={[ItemField.NAME, ItemField.BASE_TYPE]}
            />
          )}
        />
        <div className="flex flex-row justify-end gap-2">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </Dialog>
  );
}
