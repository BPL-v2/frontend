import { ScoreObjective } from "@mytypes/score";
import { Dialog } from "@components/dialog";
import { useSubmitBounty } from "@api";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { AggregationType, SubmissionCreate } from "@api";
import { DateTimePicker } from "@components/form/datetime-picker";

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
  const formRef = useRef<HTMLFormElement>(null);
  const { submitBounty } = useSubmitBounty(qc, currentEvent.id);

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
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const values = Object.fromEntries(
            new FormData(e.target as HTMLFormElement),
          );

          if (!objective) {
            return;
          }
          const submissionCreate: SubmissionCreate = {
            ...values,
            timestamp: new Date(values.timestamp as string),
            number: parseInt(values.number as string) || 1,
            objective_id: objective.id,
          };
          submitBounty(submissionCreate);
          setShowModal(false);
        }}
        className="form w-full"
      >
        <fieldset className="fieldset rounded-box bg-base-300 p-6">
          <DateTimePicker label="Time (in your timezone)" name="timestamp" />
          {(objective?.aggregation == AggregationType.MAXIMUM ||
            objective?.aggregation == AggregationType.MINIMUM) && (
            <>
              <label className="label">
                {objective?.number_field_explanation || "Submission Value"}
              </label>
              <input
                type="number"
                className="input w-full"
                required
                name="number"
              />
            </>
          )}
          <label className="label">Link to proof</label>
          <input type="text" className="input w-full" required name="proof" />
          <label className="label">Comment</label>
          <input type="text" className="input w-full" name="comment" />
        </fieldset>
      </form>
      <div className="modal-action w-full">
        <button className="btn btn-error" onClick={() => setShowModal(false)}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => formRef.current?.requestSubmit()}
        >
          Submit
        </button>
      </div>
    </Dialog>
  );
}
