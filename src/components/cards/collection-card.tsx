import { Score } from "@api";
import { CollectionCardTable } from "@components/cards/collection-card-table";
import { ObjectiveIcon } from "@components/objective-icon";
import { ScoreClass, ScoreObjective } from "@mytypes/score";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";

export interface CollectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  objective: ScoreObjective;
  ignoreExtra?: boolean;
  showPoints?: boolean;
}

// todo: find a better solution than this
function parseMultiscoreCollection(objective: ScoreObjective): ScoreObjective {
  if (objective.children.length == 0) {
    return objective;
  }
  const newObjective = { ...objective, children: [] };
  const teamIds = Object.keys(objective.team_score);
  const teamNumberMap = new Map<number, number>();
  const teamPointMap = new Map<number, number>();
  for (const teamId of teamIds) {
    for (const child of objective.children) {
      const score = child.team_score[Number(teamId)];
      if (!score) {
        continue;
      }
      teamNumberMap.set(
        Number(teamId),
        Math.max(teamNumberMap.get(Number(teamId)) || 0, score.maxNumber()),
      );
      teamPointMap.set(
        Number(teamId),
        (teamPointMap.get(Number(teamId)) || 0) + score.totalPoints(),
      );
    }
  }

  newObjective.team_score = Object.fromEntries(
    teamIds.map((teamId) => [
      Number(teamId),
      new ScoreClass({
        bonus_points: 0,
        completions: [
          {
            finished: false,
            number: teamNumberMap.get(Number(teamId)) || 0,
            points: teamPointMap.get(Number(teamId)) || 0,
            preset_id: objective.children[0].scoring_presets[0]?.id || 0,
            rank: 0,
            timestamp: Date.now(),
            user_id: undefined,
          },
        ],
      } as Score),
    ]),
  );
  newObjective.required_number = 0;
  newObjective.scoring_presets = objective.children[0].scoring_presets;
  return newObjective;
}

export function CollectionCard({
  objective,
  ignoreExtra = false,
  showPoints = true,
  ...props
}: CollectionCardProps) {
  const { currentEvent } = useContext(GlobalStateContext);
  const actualObjective = parseMultiscoreCollection(objective);
  return (
    <div
      key={actualObjective.id}
      {...props}
      className={twMerge("card bborder bg-card shadow-xl", props.className)}
    >
      <div className="m-0 card-title flex h-full min-h-22 items-center rounded-t-box bborder-b bg-base-300/50 px-4 py-2">
        <ObjectiveIcon
          objective={actualObjective}
          gameVersion={currentEvent.game_version}
        />
        <div
          className={twMerge(
            "w-full",
            actualObjective.extra && !ignoreExtra && "tooltip tooltip-primary",
          )}
        >
          {actualObjective.extra && !ignoreExtra ? (
            <div className="tooltip-content max-w-75 text-xl">
              {actualObjective.extra}
            </div>
          ) : null}
          <h3 className="grow text-center text-xl font-medium">
            {`${actualObjective.required_number ? actualObjective.required_number.toLocaleString() : ""} ${actualObjective.name}`}
            {actualObjective.extra && !ignoreExtra ? (
              <i className="text-red-600">*</i>
            ) : null}
          </h3>
        </div>
      </div>
      <div className="mb-0 rounded-b-box">
        <CollectionCardTable
          objective={actualObjective}
          showPoints={showPoints}
          roundedBottom
        />
      </div>
    </div>
  );
}
