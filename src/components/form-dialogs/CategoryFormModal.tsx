import { useEffect } from "react";
import {
  AggregationType,
  NumberField,
  Objective,
  ObjectiveCreate,
  ObjectiveType,
} from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateObjective, useGetScoringPresetsForEvent } from "@api";

interface CategoryFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  parentId: number;
  existingCategory?: Objective | null;
}

export function CategoryFormModal({
  isOpen,
  setIsOpen,
  eventId,
  parentId,
  existingCategory,
}: CategoryFormModalProps) {
  const qc = useQueryClient();
  const { scoringPresets } = useGetScoringPresetsForEvent(eventId);

  const form = useAppForm({
    defaultValues: {
      aggregation: null,
      scoring_preset_id: null,
      name: "",
      extra: "",
      number_field: NumberField.FINISHED_OBJECTIVES,
      number_field_explanation: null,
      required_number: 1,
      conditions: [],
      parent_id: parentId,
      objective_type: ObjectiveType.CATEGORY,
      scoring_preset_ids: [],
    } as unknown as ObjectiveCreate,
    onSubmit: (data) => createObjective(data.value),
  });

  const { createObjective } = useCreateObjective(qc, eventId, () => {
    setIsOpen(false);
    form.reset();
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    if (existingCategory) {
      setFormValues(form, existingCategory);
      form.setFieldValue(
        "scoring_preset_ids",
        existingCategory.scoring_presets.map((p) => p.id),
      );
    }
  }, [isOpen, existingCategory]);

  return (
    <Dialog
      title={existingCategory ? "Edit Category" : "Create Category"}
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
          name="name"
          children={(field) => <field.TextField label="Name" required />}
        />
        <form.AppField
          name="extra"
          children={(field) => <field.TextField label="Extra" />}
        />
        <form.AppField
          name="aggregation"
          children={(field) => (
            <field.SelectField
              label="Aggregation"
              options={Object.values(AggregationType)}
              required
            />
          )}
        />
        <form.AppField
          name="scoring_preset_ids"
          children={(field) => (
            <field.MultiSelectField
              label="Scoring Presets"
              options={scoringPresets.map((preset) => ({
                label: preset.name,
                value: preset.id,
              }))}
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
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}
