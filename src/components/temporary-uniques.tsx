import { GlobalStateContext } from "@utils/context-provider";
import { objectiveIsValid } from "@utils/time";
import { useContext } from "react";
import { CollectionCard } from "./cards/collection-card";
import { ScoreObjective } from "@mytypes/score";
import { Countdown } from "./countdown";

function TimerRender({ objective }: { objective: ScoreObjective }) {
  if (!objective.valid_from || !objective.valid_to) {
    return null;
  }
  const now = new Date();
  if (now < objective.valid_from) {
    return (
      <div className="flex flex-row justify-center gap-8 p-2 font-mono">
        <span className="-mt-0.5">Starts in:</span>
        <Countdown
          size="small"
          target={new Date(objective.valid_from)}
          compact
        />
      </div>
    );
  }
  if (now > objective.valid_to) {
    return <div className="text-sm">Can't be collected anymore</div>;
  }
  return (
    <div className="flex flex-row justify-center gap-8 p-2 font-mono">
      <span className="-mt-0.5">Available for:</span>
      <Countdown size="small" target={new Date(objective.valid_to)} compact />
    </div>
  );
}

export function RepeatableUniques() {
  const { scores } = useContext(GlobalStateContext);
  const repeatableUniques = scores?.children
    .find((child) => child.name === "Does not have a separate tab")
    ?.children.find((child) => child.name === "Repeatable Uniques");
  if (!repeatableUniques) {
    return null;
  }
  const checked = repeatableUniques.children.map(objectiveIsValid);
  if (!checked.some(Boolean)) {
    checked[0] = true;
  }

  return (
    <div className="card border border-primary bg-base-200 p-4 text-center text-lg font-bold">
      <h2>Repeatable Uniques</h2>
      <div className="tabs tabs-lift">
        {repeatableUniques.children.map((child, id) => (
          <>
            <input
              key={child.name}
              type="radio"
              name="my_tabs_3"
              className="tab"
              aria-label={child.name}
              defaultChecked={checked[id]}
            />
            <div
              key={child.name + "-content"}
              className="tab-content w-full border-base-300 bg-base-100 p-4"
            >
              <div className="flex flex-col gap-4">
                <TimerRender objective={child} />
                {child.children.length > 0 && (
                  <div className="grid grid-cols-5">
                    {child.children.map((grandchild) => (
                      <CollectionCard
                        key={grandchild.name}
                        objective={grandchild}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
