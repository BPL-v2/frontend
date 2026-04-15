import { ScoringMethod } from "@api";
import { preloadLadderData, useGetEventStatus, useGetTeamGoals } from "@api";
import ProgressCard from "@components/cards/progress-card";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { createFileRoute } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { flatMap } from "@utils/utils";
import { useContext } from "react";
import PoPoints from "@components/personal-objective/po-points";

export const Route = createFileRoute("/scores/for-you")({
  component: ForYouTab,
  // @ts-ignore context is not typed
  loader: async ({ context: { queryClient } }) => {
    preloadLadderData(queryClient);
  },
});

function ForYouTab() {
  const { currentEvent, scores } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { teamGoals = [] } = useGetTeamGoals(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const teamGoalMap = teamGoals.reduce(
    (acc, goal) => {
      // @ts-ignore bad type in spec
      acc[goal.objective_id] = goal.extra;
      return acc;
    },
    {} as Record<number, string>,
  );

  const teamId = eventStatus?.team_id as number;
  if (teamId === null || !eventStatus) {
    return (
      <div className="prose prose-xl flex max-w-full flex-col px-4 text-left 2xl:px-0">
        You have not been assigned to a team yet.
      </div>
    );
  }

  const objectives = flatMap(scores);
  const relevantCategories = objectives
    .filter(
      (category) =>
        category.scoring_presets[0]?.scoring_method ===
          ScoringMethod.RANKED_COMPLETION_TIME &&
        eventStatus.team_id !== undefined &&
        !category.team_score[eventStatus.team_id].isFinished(),
    )
    .sort((a, b) => {
      return (
        a.children.filter(
          (objective) => !objective.team_score[teamId].isFinished(),
        ).length /
          a.children.length -
        b.children.filter(
          (objective) => !objective.team_score[teamId].isFinished(),
        ).length /
          b.children.length
      );
    });

  const relevantObjectives = objectives
    .filter(
      (objective) =>
        objective.scoring_presets[0]?.scoring_method ===
          ScoringMethod.RANKED_TIME &&
        !objective.team_score[eventStatus.team_id!].isFinished() &&
        (!objective.valid_from || new Date(objective.valid_from) < new Date()),
    )
    .sort((a, b) => {
      return (
        b.team_score[teamId].number() / b.required_number -
        a.team_score[teamId].number() / a.required_number
      );
    });
  let suggestionsExist = false;
  for (const entry of Object.entries(teamGoalMap)) {
    if (entry[0] != String(scores?.id)) {
      suggestionsExist = true;
      break;
    }
  }
  return (
    <div className="prose prose-lg flex max-w-full flex-col px-4 text-left 2xl:px-0">
      <PoPoints />
      {teamGoals && (
        <div>
          {scores && teamGoalMap[scores.id] && (
            <>
              <h3 className="flex items-center gap-2">
                <EnvelopeIcon className="size-8" /> Your team leads have left a
                message for you:
              </h3>
              <p className="whitespace-pre-wrap text-info">
                {teamGoalMap[scores.id]}
              </p>
            </>
          )}
          {suggestionsExist && (
            <>
              <h3>
                Your team leads have selected objectives that are urgent for you
                to do.
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relevantCategories
                  .filter((category) => teamGoalMap[category.id] != undefined)
                  .map((category) => (
                    <ProgressCard key={category.id} category={category} />
                  ))}
                {relevantObjectives
                  .filter((obj) => teamGoalMap[obj.id] != undefined)
                  .map((obj) => (
                    <ProgressCard key={obj.id} category={obj} />
                  ))}
              </div>
            </>
          )}
        </div>
      )}
      <div>
        <h3>{teamGoals ? "Remaining Objectives" : "To do"}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relevantCategories
            .filter((category) => teamGoalMap[category.id] == undefined)
            .map((category) => (
              <ProgressCard key={category.id} category={category} />
            ))}
          {relevantObjectives
            .filter((obj) => teamGoalMap[obj.id] == undefined)
            .map((obj) => (
              <ProgressCard key={obj.id} category={obj} />
            ))}
        </div>
      </div>
    </div>
  );
}
