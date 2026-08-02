import { ScoreObjective } from "@mytypes/score";
import { Dialog } from "@components/dialog";
import { useFile, useSubmitBounty } from "@api";
import { useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { CountingMethod, SubmissionCreate } from "@api";
import { ascendancies } from "@mytypes/ascendancy";

type ExtendedSubmissionCreate = Omit<SubmissionCreate, "timestamp"> & {
  timestamp?: string;
};

type SubmissionFormModalProps = {
  objective?: ScoreObjective;
  showModal: boolean;
  setShowModal: (open: boolean) => void;
};

export function SubmissionFormModal({
  objective,
  showModal,
  setShowModal,
}: SubmissionFormModalProps) {
  const { currentEvent } = useContext(GlobalStateContext);
  const qc = useQueryClient();
  const { submitBounty } = useSubmitBounty(qc, currentEvent.id);
  const { data: gems } = useFile<Record<string, string[]>>(
    "/assets/poe1/items/gem_colors.json",
  );

  const allGems = new Set<string>(Object.values(gems || {}).flat());

  const form = useAppForm({
    defaultValues: {
      number: 1,
      gems_used: [],
      proof: "",
      comment: "",
    } as unknown as ExtendedSubmissionCreate,
    onSubmit: (data) => {
      if (!objective) {
        return;
      }
      submitBounty({
        ...data.value,
        timestamp: new Date(data.value.timestamp as string),
        objective_id: objective.id,
      } as SubmissionCreate);
      setShowModal(false);
      form.reset();
    },
  });

  useEffect(() => {
    if (!showModal) return;
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, objective]);

  if (!currentEvent || !objective) {
    return <></>;
  }

  return (
    <Dialog
      title={`Submission for "${objective?.name}"`}
      open={showModal}
      setOpen={setShowModal}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="form w-full"
      >
        <fieldset className="fieldset rounded-box bg-base-300 p-6">
          <form.AppField
            name="timestamp"
            children={(field) => (
              <field.DateTimeField
                label="Time (in your timezone)"
                required
              />
            )}
          />
          {(objective?.counting_method == CountingMethod.HIGHEST_VALUE ||
            objective?.counting_method == CountingMethod.LOWEST_VALUE) && (
            <form.AppField
              name="number"
              children={(field) => (
                <field.NumberField
                  label={
                    objective?.details?.tracked_value_explanation ||
                    "Submission Value"
                  }
                  required
                />
              )}
            />
          )}
          {objective?.details?.gems_limited && (
            <form.AppField
              name="gems_used"
              children={(field) => (
                <field.MultiSelectField
                  label="Gems used"
                  required={true}
                  options={Array.from(allGems).map((gem) => ({
                    label: gem,
                    value: gem,
                  }))}
                />
              )}
            />
          )}
          {objective?.details?.ascendancies_limited && (
            <form.AppField
              name="ascendancy_classes_used"
              children={(field) => (
                <field.MultiSelectField
                  label="Ascendancies used"
                  required={true}
                  options={Object.keys(ascendancies.poe1).sort((a, b) => a.localeCompare(b)).map((ascendancy) => ({
                    label: ascendancy,
                    value: ascendancy,
                  }))}
                />
              )}
            />
          )}
          <form.AppField
            name="proof"
            children={(field) => (
              <field.TextField label="Link to proof" required />
            )}
          />
          <form.AppField
            name="comment"
            children={(field) => <field.TextField label="Comment" />}
          />
        </fieldset>
        <div className="modal-action w-full">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => setShowModal(false)}
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
