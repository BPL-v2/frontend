import { useEffect } from "react";
import {
  Condition,
  ItemField,
  Objective,
  ObjectiveCreate,
  ObjectiveType,
  CountingMethod,
  Operator,
  Event,
} from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  useCreateObjective,
  useGetScoringRulesForEvent,
  useGetValidConditionMappings,
} from "@api";
import {
  dateToHoursAfterEventStart,
  hoursAfterEventStartToDate,
} from "@utils/time";

type ExtendedObjectiveCreate = ObjectiveCreate & {
  item_base_type?: string;
  item_name?: string;
  valid_from_hours?: number;
  valid_to_hours?: number;
};

interface ObjectiveFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  event: Event;
  parentId: number;
  existingObjective?: Objective | null;
}

export function ObjectiveFormModal({
  isOpen,
  setIsOpen,
  event,
  parentId,
  existingObjective,
}: ObjectiveFormModalProps) {
  const qc = useQueryClient();
  const { scoringRules } = useGetScoringRulesForEvent(event.id);
  const { trackedValuesForObjectiveType } = useGetValidConditionMappings(
    event.id,
  );

  const form = useAppForm({
    defaultValues: {
      required_number: 1,
      conditions: [],
      parent_id: parentId,
      hide_progress: false,
      scoring_rule_ids: [],
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
      console.log("Submitting objective data:", data.value);
      data.value.valid_from = hoursAfterEventStartToDate(
        event,
        data.value.valid_from_hours,
      );
      data.value.valid_to = hoursAfterEventStartToDate(
        event,
        data.value.valid_to_hours,
      );
      console.log("Transformed objective data for submission:", data.value);
      createObjective(data.value as ObjectiveCreate);
    },
  });

  const { createObjective } = useCreateObjective(qc, event.id, () => {
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
        "scoring_rule_ids",
        existingObjective.scoring_rules.map((r) => r.id),
      );
      form.setFieldValue(
        "valid_from_hours",
        dateToHoursAfterEventStart(event, existingObjective.valid_from),
      );
      form.setFieldValue(
        "valid_to_hours",
        dateToHoursAfterEventStart(event, existingObjective.valid_to),
      );
    }
  }, [isOpen, existingObjective]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div className="rounded-box border border-info/20 bg-info/10 p-3 text-left text-sm">
          Need a refresher before saving?{" "}
          <Link
            to="/admin/events/$eventId/objective-help"
            params={{ eventId: event.id }}
            className="link link-primary"
          >
            Open the objective help page
          </Link>{" "}
          for field explanations and examples.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Objective name" required />
            )}
          />
          <form.AppField
            name="extra"
            children={(field) => <field.TextField label="Extra" />}
          />
          <form.AppField
            name="objective_type"
            children={(field) => (
              <field.SelectField
                label="Objective kind"
                options={Object.values(ObjectiveType)}
              />
            )}
          />
          <form.AppField
            name="counting_method"
            children={(field) => (
              <field.SelectField
                label="How it counts"
                options={Object.values(CountingMethod)}
                required
              />
            )}
          />
          <form.AppField
            name="tracked_value"
            children={(field) => (
              <field.SelectField
                label="What to track"
                options={
                  trackedValuesForObjectiveType && objective_type
                    ? trackedValuesForObjectiveType[
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
            name="details.tracked_value_explanation"
            children={(field) => (
              <field.TextField
                label="Tracking note"
                placeholder="i.e. 'number of kills'"
                hidden={objective_type !== ObjectiveType.SUBMISSION}
              />
            )}
          />
          <form.AppField
            name="details.gems_limited"
            children={(field) => (
              <field.BooleanField
                label="Gems limited"
                hidden={objective_type !== ObjectiveType.SUBMISSION}
              />
            )}
          />
          <form.AppField
            name="details.ascendancies_limited"
            children={(field) => (
              <field.BooleanField
                label="Ascendancies limited"
                hidden={objective_type !== ObjectiveType.SUBMISSION}
              />
            )}
          />
          <form.AppField
            name="required_number"
            children={(field) => (
              <field.NumberField
                label="Target amount"
                required
                hidden={!objective_type}
              />
            )}
          />
          <form.AppField
            name="item_base_type"
            children={(field) => (
              <field.TextField
                label="Base type filter"
                hidden={objective_type !== ObjectiveType.ITEM}
              />
            )}
          />
          <form.AppField
            name="item_name"
            children={(field) => (
              <field.TextField
                label="Item name filter"
                hidden={objective_type !== ObjectiveType.ITEM}
              />
            )}
          />
          <form.AppField
            name="valid_from_hours"
            children={(field) => (
              <field.NumberField label="Starts ... hours after Event start" />
            )}
          />
          <form.AppField
            name="valid_to_hours"
            children={(field) => (
              <field.NumberField label="Ends ... hours after Event start" />
            )}
          />
          <form.AppField
            name="scoring_rule_ids"
            children={(field) => (
              <field.MultiSelectField
                label="How it gives points"
                options={scoringRules.map((rule) => ({
                  label: rule.name,
                  value: rule.id,
                }))}
              />
            )}
          />
          <form.AppField
            name="hide_progress"
            children={(field) => (
              <field.BooleanField
                label="Hide progress from players"
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
