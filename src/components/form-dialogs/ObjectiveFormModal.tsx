import { useEffect } from "react";
import {
  Condition,
  ItemField,
  Objective,
  ObjectiveCreate,
  ObjectiveType,
  AggregationType,
  Operator,
} from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateObjective,
  useGetScoringPresetsForEvent,
  useGetValidConditionMappings,
} from "@api";

type ExtendedObjectiveCreate = ObjectiveCreate & {
  item_base_type?: string;
  item_name?: string;
};

interface ObjectiveFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  parentId: number;
  existingObjective?: Objective | null;
}

export function ObjectiveFormModal({
  isOpen,
  setIsOpen,
  eventId,
  parentId,
  existingObjective,
}: ObjectiveFormModalProps) {
  const qc = useQueryClient();
  const { scoringPresets } = useGetScoringPresetsForEvent(eventId);
  const { numberFieldsForObjectiveType } =
    useGetValidConditionMappings(eventId);

  const form = useAppForm({
    defaultValues: {
      required_number: 1,
      conditions: [],
      parent_id: parentId,
      hide_progress: false,
      scoring_preset_ids: [],
    } as unknown as ExtendedObjectiveCreate,
    onSubmit: (data) => {
      if (data.value.item_name) {
        data.value.conditions = extendConditions(
          data.value.conditions,
          data.value.item_name,
          ItemField.NAME,
        );
        delete data.value.item_name;
      }
      if (data.value.item_base_type) {
        data.value.conditions = extendConditions(
          data.value.conditions,
          data.value.item_base_type,
          ItemField.BASE_TYPE,
        );
        delete data.value.item_base_type;
      }
      createObjective(data.value as ObjectiveCreate);
    },
  });

  const { createObjective } = useCreateObjective(qc, eventId, () => {
    setIsOpen(false);
    form.reset();
  });

  const { objective_type } = useStore(form.store, (state) => state.values);

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    if (existingObjective) {
      setFormValues(form, existingObjective);
      form.setFieldValue(
        "item_base_type",
        existingObjective.conditions.find(
          (c) => c.field === ItemField.BASE_TYPE && c.operator === Operator.EQ,
        )?.value,
      );
      form.setFieldValue(
        "item_name",
        existingObjective.conditions.find(
          (c) => c.field === ItemField.NAME && c.operator === Operator.EQ,
        )?.value,
      );
      form.setFieldValue(
        "scoring_preset_ids",
        existingObjective.scoring_presets.map((p) => p.id),
      );
    }
  }, [isOpen, existingObjective]);

  return (
    <Dialog
      title={existingObjective ? "Edit Objective" : "Create Objective"}
      open={isOpen}
      setOpen={setIsOpen}
      className="h-[80vh] max-h-[90vh] max-w-2xl"
    >
      <form
        className="flex w-full flex-col gap-2 rounded-box bg-base-300 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" required />}
          />
          <form.AppField
            name="extra"
            children={(field) => <field.TextField label="Extra" />}
          />
          <form.AppField
            name="objective_type"
            children={(field) => (
              <field.SelectField
                label="Objective Type"
                options={Object.values(ObjectiveType)}
              />
            )}
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
            name="number_field"
            children={(field) => (
              <field.SelectField
                label="Number Field"
                options={
                  numberFieldsForObjectiveType && objective_type
                    ? numberFieldsForObjectiveType[
                        objective_type as ObjectiveType
                      ]
                    : []
                }
                required
                hidden={!objective_type}
              />
            )}
          />
          <form.AppField
            name="number_field_explanation"
            children={(field) => (
              <field.TextField
                label="Submission Value Explanation"
                hidden={!objective_type}
              />
            )}
          />
          <form.AppField
            name="required_number"
            children={(field) => (
              <field.NumberField
                label="Required Number"
                required
                hidden={!objective_type}
              />
            )}
          />
          <form.AppField
            name="item_base_type"
            children={(field) => (
              <field.TextField
                label="Base Type"
                hidden={objective_type !== ObjectiveType.ITEM}
              />
            )}
          />
          <form.AppField
            name="item_name"
            children={(field) => (
              <field.TextField
                label="Item Name"
                hidden={objective_type !== ObjectiveType.ITEM}
              />
            )}
          />
          <form.AppField
            name="valid_from"
            children={(field) => (
              <field.DateTimeField label="Valid From" />
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
          <form.AppField
            name="valid_to"
            children={(field) => <field.DateTimeField label="Valid To" />}
          />
          <form.AppField
            name="hide_progress"
            children={(field) => (
              <field.BooleanField
                label="Hide Progress"
                className="checkbox-xl checkbox-primary"
              />
            )}
          />
        </div>
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

function extendConditions(
  conditions: Condition[],
  value: string,
  field: ItemField,
) {
  let exists = false;
  const newConditions = conditions.map((condition) => {
    if (condition.field === field && condition.operator === Operator.EQ) {
      condition.value = value;
      exists = true;
    }
    return condition;
  });
  if (!exists) {
    newConditions.push({ field, operator: Operator.EQ, value });
  }
  return newConditions;
}
