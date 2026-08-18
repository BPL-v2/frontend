import { useContext, useState } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { ScoreObjective } from "@mytypes/score";
import { ObjectiveType, ScoringRuleType } from "@api";
import { twMerge } from "tailwind-merge";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useGetEventStatus } from "@api";
import { Countdown } from "@components/countdown";
import { SubmissionFormModal } from "@components/form-dialogs/SubmissionFormModal";
import { ObjectiveIcon } from "@components/objective-icon";
import { CollectionCardTable } from "./collection-card-table";
import { ConditionDescription } from "@components/conditions/condition-description";

export type DailyCardProps = {
  objective: ScoreObjective;
};

function bonusAvailableCounter(
  valid_to: string | Date | null | undefined,
  _onFinish: () => void,
) {
  if (!valid_to) {
    return null;
  }
  if (new Date(valid_to) < new Date()) {
    return <p className="text-lg"> Daily no longer available</p>;
  }

  return (
    <div className="flex flex-row justify-center gap-4 p-2">
      <p className="text-center text-lg">Daily available for</p>
      <div className="flex justify-center">
        <Countdown target={new Date(valid_to)} size="small" />
      </div>
    </div>
  );
}

export function DailyCard({ objective }: DailyCardProps) {
  const { currentEvent } = useContext(GlobalStateContext);
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();
  const { eventStatus } = useGetEventStatus(currentEvent.id);

  if (!currentEvent || !objective.valid_from) {
    return <></>;
  }
  const isReleased = new Date(objective.valid_from) < new Date();

  if (!isReleased) {
    return (
      <div
        className="card cursor-default bg-card bborder caret-transparent shadow-xl"
        key={objective.id}
      >
        <div className="h-full min-h-25 rounded-t-box p-8 pb-0 text-center text-xl font-semibold">
          Daily not yet available
        </div>
        <div className="card-body rounded-b-box p-8 pt-0">
          <p className="text-center text-lg">The daily will be available in:</p>
          <div className="flex justify-center">
            <Countdown target={new Date(objective.valid_from)} />
          </div>
        </div>
      </div>
    );
  }
  const finished = Object.values(objective.team_score).reduce(
    (acc, score) => score.isFinished() && acc,
    true,
  );

  const isRace =
    objective.scoring_rules[0]?.scoring_rule ===
    ScoringRuleType.RANK_BY_COMPLETION_TIME;
  const isAvailable =
    objective.valid_to && new Date(objective.valid_to) > new Date();
  const canSubmit =
    objective.objective_type === ObjectiveType.SUBMISSION &&
    !!eventStatus?.team_id &&
    new Date(currentEvent.event_start_time) < new Date() &&
    new Date(currentEvent.event_end_time) > new Date();
  return (
    <>
      {canSubmit && (
        <SubmissionFormModal
          objective={objective}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <ConditionDescription objective={objective}>
        <div
          className={twMerge(
            "card bg-card bborder caret-transparent shadow-xl *:cursor-default",
            isRace && isAvailable ? "outline-4 outline-info" : "",
          )}
          key={objective.id}
        >
          <div className="m-0 card-title flex h-full min-h-22 items-center rounded-t-box bborder-b bg-base-300/50 px-4 py-2">
            {canSubmit ? (
              <div
                className="tooltip tooltip-left lg:tooltip-top"
                data-tip="Submit Bounty"
              >
                <button
                  className="rounded-full"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <PlusCircleIcon className="size-8 cursor-pointer" />
                </button>
              </div>
            ) : (
              <ObjectiveIcon
                objective={objective}
                gameVersion={currentEvent.game_version}
              />
            )}
            <div className={objective.extra ? "tooltip" : undefined}>
              {objective.extra && (
                <div className="tooltip-content max-w-75 border border-primary bg-base-200 text-xl text-base-content">
                  {objective.extra}
                </div>
              )}

              <h3 className="mx-4 grow text-center text-lg font-medium">
                {isRace ? (
                  <b className="font-extrabold text-info">Race: </b>
                ) : (
                  ""
                )}
                {objective.name}
                {objective.extra ? <i className="text-error">*</i> : null}
              </h3>
            </div>
          </div>
          <div className={finished ? "rounded-b-box" : ""}>
            <CollectionCardTable objective={objective} />
          </div>
          {!finished && (
            <div className="flex min-h-15 items-center justify-center rounded-b-box">
              {bonusAvailableCounter(objective.valid_to, () => {
                qc.refetchQueries({
                  queryKey: ["rules", currentEvent.id],
                });
              })}
            </div>
          )}
        </div>{" "}
      </ConditionDescription>
    </>
  );
}
