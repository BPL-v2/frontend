import { useGetEventStatus } from "@api";
import { ScoreObjective } from "@mytypes/score";
import { GlobalStateContext } from "@utils/context-provider";
import { getPotentialPoints, getTotalPoints } from "@utils/utils";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { TeamName } from "./team-name";
import { TeamLogo } from "./teamlogo";
import { renderScore } from "@utils/score";

export type TeamScoreProps = {
  selectedTeam?: number;
  setSelectedTeam?: (teamId: number) => void;
  objective?: ScoreObjective;
};

const TeamScoreDisplay = ({
  objective,
  selectedTeam,
  setSelectedTeam,
}: TeamScoreProps) => {
  const { currentEvent, preferences } = useContext(GlobalStateContext);
  const nullScore = currentEvent.teams.reduce(
    (acc, team) => {
      acc[team.id] = 0;
      return acc;
    },
    {} as { [teamId: number]: number },
  );
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const teamScores = objective ? getTotalPoints(objective) : nullScore;
  const potentialScores = objective ? getPotentialPoints(objective) : nullScore;
  if (!currentEvent || !currentEvent.teams) {
    return <></>;
  }
  return (
    <>
      <div
        className={
          "grid min-h-20 md:min-h-32 grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-1 md:grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3 2xl:px-0 mt-4 select-none"
        }
      >
        {currentEvent.teams
          .sort((a, b) => {
            if (a.id === eventStatus?.team_id) return -1;
            if (b.id === eventStatus?.team_id) return 1;
            if (teamScores[b.id] === teamScores[a.id]) {
              return b.id - a.id;
            }
            return teamScores[b.id] - teamScores[a.id];
          })
          .slice(0, preferences.limitTeams ? preferences.limitTeams : undefined)
          .map((team) => {
            return (
              <div
                className={twMerge(
                  "flex rounded-box bborder p-0 outline-3",
                  team.id === eventStatus?.team_id
                    ? "content-highlight bg-card-highlight"
                    : "bg-card",
                  team.id === selectedTeam
                    ? "border-transparent outline-primary"
                    : "outline-transparent",
                  selectedTeam && "cursor-pointer hover:bg-base-200",
                )}
                key={team.id}
                onClick={() =>
                  setSelectedTeam ? setSelectedTeam(team.id) : null
                }
              >
                <div className="flex w-full justify-around p-1 md:p-4 items-center">
                  <div className="flex flex-col md:gap-2">
                    <TeamName
                      team={team}
                      className="text-xl font-bold md:text-2xl"
                    />
                    <div className="text-xl whitespace-nowrap md:text-2xl">
                      <span>
                        {currentEvent?.uses_medals
                          ? renderScore(teamScores[team.id], potentialScores[team.id], true)
                          : potentialScores[team.id] !== undefined && potentialScores[team.id] !== Infinity
                            ? <>
                                <span className="font-bold">{teamScores[team.id]}</span>
                                <span className="text-base-content/50"> · {potentialScores[team.id]}</span>
                              </>
                            : teamScores[team.id]
                        }
                      </span>
                    </div>
                  </div>
                  <TeamLogo
                    team={team}
                    eventId={currentEvent.id}
                    className="row-span-2 hidden size-24 md:flex"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default TeamScoreDisplay;
