import { useGetEventStatus, useGetTeamGoals } from "@api";
import { ChevronDownIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { ScoreObjective } from "@mytypes/score";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  category: ScoreObjective;
}

export default function ProgressCard({ category }: Props) {
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { teamGoals = [] } = useGetTeamGoals(currentEvent.id);
  const teamId = eventStatus?.team_id;
  const message = teamGoals.find(
    (goal) => goal.objective_id === category.id,
  )?.extra;
  const childLeaves = category.children.filter(
    (obj) => obj.children.length === 0,
  );
  let requiredNum = childLeaves.length;

  if (!teamId) {
    return <></>;
  }
  const unfinishedObjectives = childLeaves.filter(
    (obj) => !obj.team_score[teamId].isFinished(),
  );
  let currentNum = requiredNum - unfinishedObjectives.length;

  if (childLeaves.length === 0) {
    requiredNum = category.required_number;
    currentNum = category.team_score[teamId].number();
  }
  if (currentNum > requiredNum) {
    return <></>;
  }
  return (
    <div className="flex min-h-28 flex-col overflow-hidden rounded-lg border-2 border-[oklch(25%_0.025_265)] shadow-xl select-none transition-all duration-300" key={category.id}>
      <div className="flex flex-1 flex-col justify-center gap-1 bg-base-300 p-2">
        {unfinishedObjectives.length > 0 ? (
          <CollapsibleTitle
            name={category.name}
            currentNum={currentNum}
            requiredNum={requiredNum}
            unfinishedObjectives={unfinishedObjectives}
          />
        ) : (
          <div className="flex justify-between gap-4 p-4 text-lg font-bold">
            <div>{category.name}</div>
            <div className="whitespace-nowrap text-primary">
              {currentNum} / {requiredNum}
            </div>
          </div>
        )}
        {message && (
          <div className="tooltip">
            <div className="tooltip-content p-4 text-left text-lg whitespace-pre-wrap text-error">
              {message}
            </div>
            <EnvelopeIcon className="size-6 cursor-help text-error" />
          </div>
        )}
      </div>
      <div className="h-4 w-full bg-primary/30">
        <div
          className="h-full rounded-r-full rounded-bl-full bg-primary"
          style={{ width: `${(currentNum / requiredNum) * 100}%` }}
        />
      </div>
    </div>
  );
}

function CollapsibleTitle({
  name,
  currentNum,
  requiredNum,
  unfinishedObjectives,
}: {
  name: string;
  currentNum: number;
  requiredNum: number;
  unfinishedObjectives: ScoreObjective[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className="flex cursor-pointer justify-between gap-4 p-4 text-lg font-bold"
        onClick={() => setOpen(!open)}
      >
        <div className={twMerge("flex items-center gap-2 transition-colors", open && "text-primary/90")}>
          {name}
          <ChevronDownIcon
            className={twMerge("size-4 transition-transform duration-300", open && "rotate-180")}
          />
        </div>
        <div className="whitespace-nowrap text-primary">
          {currentNum} / {requiredNum}
        </div>
      </div>
      <div className={twMerge("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
      <ul className="not-prose list overflow-hidden">
        <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
          Missing Items
        </li>
        {unfinishedObjectives.map((obj) => (
          <li className="list-row" key={obj.id}>
            {obj.name}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
