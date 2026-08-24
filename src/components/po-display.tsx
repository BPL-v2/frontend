import { useGetEventStatus } from "@api";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext } from "react";
import POProgressBar from "./personal-objective/po-progress";
import { TeamName } from "./team/team-name";

export function PoDisplay() {
  const { scores, currentEvent, isMobile, preferences } =
    useContext(GlobalStateContext);
  const objs = scores?.children
    .find((category) => category.name === "Does not have a separate tab")
    ?.children.find(
      (category) => category.name === "Personal Objectives",
    )?.children;
  const { eventStatus } = useGetEventStatus(currentEvent.id);

  const totalObjective = objs?.find(
    (obj) => obj.scoring_rules[0]?.point_cap || 0 > 0,
  );
  const checkPoints = objs
    ?.filter((obj) => !obj.scoring_rules[0]?.point_cap)
    .sort(
      (a, b) => (a.valid_from?.getTime() || 0) - (b.valid_from?.getTime() || 0),
    );
  if (!totalObjective || !checkPoints) {
    return null;
  }
  return (
    <div>
      <div className="divider divider-primary">Personal Objective Points</div>
      <div className="card bg-base-300">
        <div className="card-body">
          <div className="flex flex-col gap-2">
            {currentEvent.teams
              .sort((a, b) => {
                if (a.id === eventStatus?.team_id) return -1;
                if (b.id === eventStatus?.team_id) return 1;
                return (
                  totalObjective.team_score[b.id].number() -
                  totalObjective.team_score[a.id].number()
                );
              })
              .slice(
                0,
                preferences.limitTeams ? preferences.limitTeams : undefined,
              )

              .map((team) => {
                const values = [];
                const extra = [];
                let total = 0;
                for (const obj of checkPoints) {
                  const teamScore = obj.team_score[team.id];
                  const points = teamScore.totalPoints();
                  if (points === 0) {
                    continue;
                  }
                  const number = teamScore.number();
                  total += points;
                  values.push(number);
                  extra.push(points);
                }
                const cap = totalObjective?.scoring_rules[0]?.point_cap || 0;
                const current = Math.min(
                  totalObjective?.team_score[team.id].number() || 0,
                  cap,
                );
                total += current;
                if (isMobile) {
                  return (
                    <div className="flex flex-col gap-1" key={team.id}>
                      <div className="flex items-center justify-between">
                        <TeamName className="font-semibold" team={team} />
                        <span className="font-semibold">{total}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
                        <div
                          className="h-full rounded-full bg-success"
                          style={{
                            width: `${cap > 0 ? Math.min((total / cap) * 100, 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="flex flex-col" key={team.id}>
                    <div className="flex flex-row justify-start gap-2 text-lg">
                      <TeamName className="font-semibold" team={team} />
                      {extra.length > 0 ? (
                        <div className="">{`${total} = (${current} + ${extra.join(" + ")})`}</div>
                      ) : (
                        <div className="">{total}</div>
                      )}
                    </div>
                    <POProgressBar
                      checkpoints={values}
                      extra={extra}
                      max={cap}
                      current={current}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
