import { ItemField, Objective, ObjectiveCreate, Operator } from "@api";
import { Dialog } from "@components/dialog";
import { useAppForm } from "@components/form/context";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateObjective, useGetValidConditionMappings } from "@api";

interface ConditionFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  objective: Objective;
}

export function ConditionFormModal({
  isOpen,
  setIsOpen,
  eventId,
  objective,
}: ConditionFormModalProps) {
  const qc = useQueryClient();
  const { operatorForField } = useGetValidConditionMappings(eventId);

  const form = useAppForm({
    defaultValues: {} as {
      field: ItemField;
      operator: Operator;
      value: string;
    },
    onSubmit: (data) => {
      const updatedConditions = [
        ...objective.conditions.filter(
          (c) =>
            !(
              c.field === data.value.field && c.operator === data.value.operator
            ),
        ),
        data.value,
      ];
      const objectiveCreate: ObjectiveCreate = {
        ...objective,
        scoring_preset_ids: objective.scoring_presets.map((p) => p.id),
        conditions: updatedConditions,
      };
      createObjective(objectiveCreate);
    },
  });

  const { createObjective } = useCreateObjective(qc, eventId, () => {
    setIsOpen(false);
    form.reset();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { field: itemField } = useStore(
    form.store,
    (state: any) => state.values,
  );
  const operatorOptions: Operator[] =
    operatorForField && itemField
      ? operatorForField[itemField as ItemField]
      : [];

  return (
    <Dialog
      title="Create Condition"
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
          name="field"
          children={(field: any) => (
            <field.SelectField
              label="Field"
              options={Object.values(ItemField)}
              required
            />
          )}
        />
        <form.AppField
          name="operator"
          children={(field: any) => (
            <field.SelectField
              label="Operator"
              options={operatorOptions}
              required
              hidden={!itemField}
            />
          )}
        />
        <form.AppField
          name="value"
          children={(field: any) => <field.TextField label="Value" required />}
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
