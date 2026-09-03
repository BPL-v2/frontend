import { ItemWithCompletions, ItemMod } from "@api";
import { useGetEventStatus, useGetGuildStashTab, useGetRules } from "@api";
import { Dialog } from "@components/dialog";
import { StashTabGrid } from "@components/stash/stash-tab-grid";
import { StashTabSpecial } from "@components/stash/stash-tab-special";
import { StashTabUnique } from "@components/stash/stash-tab-unique";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { GlobalStateContext } from "@utils/context-provider";
import { findObjective } from "@utils/utils";
import { useContext, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type StashType = "Grid" | "Special" | "Unique";
export type ScoreQueryParams = {
  highlightScoring: boolean;
};

function fixDivcardMods(mod: ItemMod): ItemMod[] {
  let cleanedText = mod.description;
  while (/\u003c[^>]+\u003e/.test(cleanedText)) {
    cleanedText = cleanedText.replace(/\u003c[^>]+\u003e/g, "");
  }
  cleanedText = cleanedText.replace(/[{}]/g, "");
  return cleanedText
    .split("\r\n")
    .map((line) => line.replace(/\{([^}]+)\}/g, "$1"))
    .filter((line) => line.trim())
    .map((line) => ({ description: line, flags: mod.flags }));
}
export function GuildStashView({
  highlightScoring,
  stashId,
}: {
  highlightScoring: boolean;
  stashId: string;
}) {
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const {
    data: currentTab,
    isPending,
    isError,
  } = useGetGuildStashTab(currentEvent.id, eventStatus?.team_id || 0, stashId);
  const { rules } = useGetRules(currentEvent.id);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithCompletions | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const width = 700;
  if (isPending) {
    return (
      <div
        className="animate-pulse bg-base-200 duration-1000"
        style={{ width: width, height: width }}
      ></div>
    );
  }
  if (isPending || isError || !currentTab) {
    return (
      <div
        className="bg-base-200"
        style={{ width: width, height: width }}
      ></div>
    );
  }
  let type: StashType = "Special";
  if (currentTab.type === "PremiumStash" || currentTab.type === "QuadStash") {
    type = "Grid";
  } else if (currentTab.type === "UniqueStash") {
    type = "Unique";
  }
  let textColor = "text-white";
  switch (selectedItem?.rarity) {
    case "Unique":
      textColor = "text-unique";
      break;
    case "Rare":
      textColor = "text-rare";
      break;
    case "Magic":
      textColor = "text-magic";
      break;
  }
  return (
    <div ref={ref}>
      <Dialog
        className="max-h-[80vh] max-w-xl"
        open={open}
        setOpen={setOpen}
        title={
          <div>
            <ClipboardDocumentCheckIcon
              className="to-0 absolute right-6 size-8 cursor-pointer hover:text-primary"
              onClick={() => {
                if (selectedItem) {
                  navigator.clipboard.writeText(
                    JSON.stringify(selectedItem, null, 2),
                  );
                }
              }}
            ></ClipboardDocumentCheckIcon>
            <div
              className={twMerge("-mb-4 flex flex-col items-center", textColor)}
            >
              {selectedItem?.name ? <p> {selectedItem?.name}</p> : null}
              <p> {selectedItem?.typeLine}</p>
            </div>
          </div>
        }
        closeOnOutsideClick={true}
      >
        <div className="">
          {selectedItem?.influences && (
            <>
              <div className="mb-2 flex flex-row gap-2">
                Influences:{" "}
                {Object.keys(selectedItem?.influences || {}).map(
                  (influence) => (
                    <span key={influence}>{influence}</span>
                  ),
                )}
              </div>
            </>
          )}
          {(selectedItem?.properties?.length || 0) > 0 && (
            <div className="flex flex-col">
              {selectedItem?.properties?.map((prop) => {
                if (prop.displayMode === 3) {
                  const values = prop.values?.map((v) => String(v[0]));
                  let name = prop.name || "";
                  values?.forEach((value, i) => {
                    name = name.replace(`{${i}}`, value);
                  });

                  return <span className="text-base-content/80">{name}</span>;
                }
                return (
                  <p>
                    <span className="text-base-content/80">{prop.name}:</span>{" "}
                    <span className="text-magic">
                      {String(prop.values?.[0]?.[0] || prop.values?.[0]?.[1])}{" "}
                      {prop.displayMode == 1
                        ? String(prop.values?.[0]?.[1])
                        : ""}
                    </span>
                  </p>
                );
              })}
            </div>
          )}
          {selectedItem?.ilvl !== 0 && (
            <>
              <div className="divider m-0"></div>
              <span className="text-base-content/80">Item Level:</span>{" "}
              <span className="text-magic">{selectedItem?.ilvl}</span>
            </>
          )}
          {selectedItem?.implicitMods && (
            <>
              <div className="divider m-0"></div>
              <div className="flex flex-col text-magic">
                {selectedItem.implicitMods.map((mod, idx) => (
                  <p key={idx}>{mod.description}</p>
                ))}
              </div>
            </>
          )}
          {(selectedItem?.explicitMods) && (
            <>
              <div className="divider m-0"></div>
              <div className="flex flex-col">
                {selectedItem.explicitMods
                  ?.flatMap((mod) => fixDivcardMods(mod))
                  .map((mod, idx) => {
                    let textColor = "text-magic";
                    if (mod.flags?.crafted) {
                      textColor = "text-crafted";
                    } else if (mod.flags?.fractured) {
                      textColor = "text-fractured";
                    }
                    return (
                      <span className={textColor} key={idx}>
                        {mod.description}
                      </span>
                    );
                  })}
              </div>
            </>
          )}
        </div>
        {selectedItem?.objective_id &&
          `Counts for "${
            findObjective(rules, (obj) => selectedItem.objective_id === obj.id)
              ?.name
          }"`}
      </Dialog>

      {type == "Grid" && (
        <StashTabGrid
          size={width}
          tab={currentTab}
          onItemClick={(item) => {
            setSelectedItem(item);
            setOpen(true);
          }}
          highlightScoring={highlightScoring}
        ></StashTabGrid>
      )}
      {type == "Special" && (
        <StashTabSpecial
          tab={currentTab}
          size={width}
          onItemClick={(item) => {
            setSelectedItem(item);
            setOpen(true);
          }}
          highlightScoring={highlightScoring}
        ></StashTabSpecial>
      )}
      {type == "Unique" && (
        <StashTabUnique
          tab={currentTab}
          size={width}
          onItemClick={(item) => {
            setSelectedItem(item);
            setOpen(true);
          }}
          highlightScoring={highlightScoring}
        />
      )}
    </div>
  );
}
