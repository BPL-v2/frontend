import { useEffect } from "react";
import {
  CountingMethod,
  TrackedValue,
  Objective,
  ObjectiveCreate,
  ObjectiveType,
} from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateObjective, useGetScoringRulesForEvent } from "@api";

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
  const { scoringRules } = useGetScoringRulesForEvent(eventId);

  const form = useAppForm({
    defaultValues: {
      counting_method: null,
      name: "",
      extra: "",
      tracked_value: TrackedValue.COMPLETED_CHILD_OBJECTIVE_COUNT,
      tracked_value_explanation: null,
      required_number: 1,
      conditions: [],
      parent_id: parentId,
      objective_type: ObjectiveType.CATEGORY,
      scoring_rule_ids: [],
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
        "scoring_rule_ids",
        existingCategory.scoring_rules.map((r) => r.id),
      );
    }
  }, [isOpen, existingCategory]); // eslint-disable-line react-hooks/exhaustive-deps

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
          name="counting_method"
          children={(field) => (
            <field.SelectField
              label="Counting Method"
              options={Object.values(CountingMethod)}
              required
            />
          )}
        />
        <form.AppField
          name="scoring_rule_ids"
          children={(field) => (
            <field.MultiSelectField
              label="Scoring Rules"
              options={scoringRules.map((rule) => ({
                label: rule.name,
                value: rule.id,
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
