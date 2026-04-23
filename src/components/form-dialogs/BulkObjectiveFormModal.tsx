import { CountingMethod, ItemField } from "@api";
import { Dialog } from "@components/dialog";
import { useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateBulkObjectives, useGetScoringRulesForEvent } from "@api";

export type BulkObjectiveCreate = {
  nameList: string;
  scoring_rule_ids: number[];
  counting_method: CountingMethod;
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
  const { scoringRules } = useGetScoringRulesForEvent(eventId);

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
          children={(field) => (
            <field.TextField
              label="Name List (Comma separated)"
              required
              placeholder="Item1, Item2, Item3"
            />
          )}
        />
        <form.AppField
          name="scoring_rule_ids"
          children={(field) => (
            <field.MultiSelectField
              label="Scoring Rules"
              className="w-full"
              options={scoringRules.map((rule) => ({
                label: rule.name,
                value: rule.id,
              }))}
            />
          )}
        />
        <form.AppField
          name="counting_method"
          children={(field) => (
            <field.SelectField
              label="Counting Method"
              className="w-full"
              required
              options={Object.values(CountingMethod)}
            />
          )}
        />
        <form.AppField
          name="item_field"
          children={(field) => (
            <field.SelectField
              label="Item Field"
              className="w-full"
              required
              options={[ItemField.NAME, ItemField.BASE_TYPE]}
            />
          )}
        />
        <div className="mt-4 flex flex-row justify-end gap-2">
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
