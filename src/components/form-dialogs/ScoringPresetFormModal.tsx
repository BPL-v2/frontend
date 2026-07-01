import { useEffect } from "react";
import { ScoringRuleType, ScoringRule, ScoringRuleCreate } from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useAddScoringRule } from "@api";

interface ScoringRuleFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  existingRule?: ScoringRule | null;
}

export function ScoringRuleFormModal({
  isOpen,
  setIsOpen,
  eventId,
  existingRule,
}: ScoringRuleFormModalProps) {
  const qc = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      points: [] as number[],
      extra: {},
    } as ScoringRuleCreate,
    onSubmit: (data) => {
      const create = JSON.parse(
        JSON.stringify(data.value),
      ) as ScoringRuleCreate;
      if (typeof data.value.points === "string") {
        create.points = (data.value.points as never as string)
          .split(",")
          .filter((p) => p.trim())
          .map((point: string) => parseFloat(point.trim()));
      }
      addScoringRule(create);
    },
  });

  const { addScoringRule } = useAddScoringRule(qc, eventId, () => {
    setIsOpen(false);
    form.reset();
  });

  const { scoring_rule } = useStore(form.store, (state) => state.values);

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    if (existingRule) {
      setFormValues(form, existingRule);
    }
  }, [isOpen, existingRule]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog
      open={isOpen}
      title={existingRule ? "Edit Scoring Rule" : "Create Scoring Rule"}
      setOpen={setIsOpen}
      className="max-w-md"
    >
      <form
        className="flex w-full flex-col gap-2 rounded-box bg-base-300 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="rounded-box border border-info/20 bg-info/10 p-3 text-left text-sm">
          Need help choosing a rule?{" "}
          <Link
            to="/admin/events/$eventId/objective-help"
            params={{ eventId }}
            className="link link-primary"
          >
            Open the objective help page
          </Link>
          .
        </div>
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Rule name" required />}
        />
        <form.AppField
          name="points"
          children={(field) => <field.TextField label="Points" required />}
        />
        <form.AppField
          name="scoring_rule"
          children={(field) => (
            <field.SelectField
              label="Scoring Rule"
              options={Object.values(ScoringRuleType)}
              required
            />
          )}
        />
        <form.AppField
          name="extra.required_bingo_count"
          children={(field) => (
            <field.TextField
              label="Required Number of Bingos"
              hidden={scoring_rule !== ScoringRuleType.BINGO_BOARD_RANKING}
            />
          )}
        />
        {scoring_rule === ScoringRuleType.RANK_BY_CHILD_COMPLETION_TIME && (
          <div className="flex flex-col gap-1 rounded-lg border border-highlight p-2">
            <p className="px-2 text-left text-neutral-content/40">
              Required child completions
            </p>
            <div className="flex flex-row">
              <form.AppField
                name="extra.required_completed_children"
                children={(field) => (
                  <field.TextField
                    label="Number"
                    hidden={
                      scoring_rule !==
                      ScoringRuleType.RANK_BY_CHILD_COMPLETION_TIME
                    }
                  />
                )}
              />
              <form.AppField
                name="extra.required_completed_children_percent"
                children={(field) => (
                  <field.TextField
                    label="Percentage"
                    hidden={
                      scoring_rule !==
                      ScoringRuleType.RANK_BY_CHILD_COMPLETION_TIME
                    }
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
              required={scoring_rule === ScoringRuleType.POINTS_BY_VALUE}
              hidden={scoring_rule !== ScoringRuleType.POINTS_BY_VALUE}
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
