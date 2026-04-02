import { useEffect } from "react";
import { ScoringMethod, ScoringPreset, ScoringPresetCreate } from "@client/api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAddScoringPreset } from "@client/query";

interface ScoringPresetFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  existingPreset?: ScoringPreset | null;
}

export function ScoringPresetFormModal({
  isOpen,
  setIsOpen,
  eventId,
  existingPreset,
}: ScoringPresetFormModalProps) {
  const qc = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      points: [] as number[],
      extra: {},
    } as ScoringPresetCreate,
    onSubmit: (data) => {
      const create = JSON.parse(JSON.stringify(data.value)) as ScoringPresetCreate;
      if (typeof data.value.points === "string") {
        create.points = (data.value.points as never as string)
          .split(",")
          .filter((p) => p.trim())
          .map((point: string) => parseFloat(point.trim()));
      }
      addScoringPreset(create);
    },
  });

  const { addScoringPreset } = useAddScoringPreset(qc, eventId, () => {
    setIsOpen(false);
    form.reset();
  });

  const { scoring_method } = useStore(form.store, (state) => state.values);

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    if (existingPreset) {
      setFormValues(form, existingPreset);
    }
  }, [isOpen, existingPreset]);

  return (
    <Dialog
      open={isOpen}
      title={existingPreset ? "Edit Preset" : "Create Preset"}
      setOpen={setIsOpen}
      className="max-w-md"
    >
      <form
        className="fieldset w-full rounded-box bg-base-300 p-6"
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
          name="points"
          children={(field) => <field.TextField label="Points" required />}
        />
        <form.AppField
          name="scoring_method"
          children={(field) => (
            <field.SelectField
              label="Scoring Method"
              options={Object.values(ScoringMethod)}
              required
            />
          )}
        />
        <form.AppField
          name="extra.required_number_of_bingos"
          children={(field) => (
            <field.TextField
              label="Required Number of Bingos"
              hidden={scoring_method !== ScoringMethod.BINGO_BOARD}
            />
          )}
        />
        {scoring_method === ScoringMethod.RANKED_COMPLETION_TIME && (
          <div className="flex flex-col gap-1 rounded-lg border border-highlight p-2">
            <p className="px-2 text-left text-neutral-content/40">
              Required child completions
            </p>
            <div className="flex flex-row">
              <form.AppField
                name="extra.required_child_completions"
                children={(field) => (
                  <field.TextField
                    label="Number"
                    hidden={scoring_method !== ScoringMethod.RANKED_COMPLETION_TIME}
                  />
                )}
              />
              <form.AppField
                name="extra.required_child_completions_percent"
                children={(field) => (
                  <field.TextField
                    label="Percentage"
                    hidden={scoring_method !== ScoringMethod.RANKED_COMPLETION_TIME}
                  />
                )}
              />
            </div>
          </div>
        )}
        <form.AppField
          name="point_cap"
          children={(field) => (
            <field.NumberField
              label="Point Cap"
              required={scoring_method === ScoringMethod.POINTS_FROM_VALUE}
              hidden={scoring_method !== ScoringMethod.POINTS_FROM_VALUE}
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
            Submit
          </button>
        </div>
      </form>
    </Dialog>
  );
}
