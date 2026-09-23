import {
  accountColumn,
  ascendancyColumn,
  characterColumn,
  delveDepthColumn,
  levelColumn,
  mobilePortraitColumn,
  teamColumn,
} from "@components/ladder/ladder-columns";
import { useTeamLookup } from "@utils/ladder-hooks";
import { LadderEntry, TrackedValue } from "@api";
import { preloadLadderData, useGetLadder, useGetUsers } from "@api";
import { CollectionCardTable } from "@components/cards/collection-card-table";
import { ObjectiveIcon } from "@components/objective-icon";
import { Ranking } from "@components/ranking";
import VirtualizedTable from "@components/table/virtualized-table";
import TeamScoreDisplay from "@components/team/team-score";
import { DelveTabRules } from "@rules/delve";
import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@components/table/react-table-shim";
import { GlobalStateContext } from "@utils/context-provider";
import { JSX, useContext, useEffect, useMemo, useState } from "react";
import { ObjectiveCard } from "@components/cards/objective-card";

export const Route = createFileRoute("/scores/delve")({
  component: DelveTab,
  // @ts-ignore context is not typed
  loader: async ({ context: { queryClient } }) => {
    preloadLadderData(queryClient);
  },
});

function DelveTab(): JSX.Element {
  const { scores, currentEvent, isMobile } = useContext(GlobalStateContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { rules } = Route.useSearch();
  const { data: ladder = [] } = useGetLadder(currentEvent.id);
  const { data: users } = useGetUsers(currentEvent.id);
  const category = scores?.children.find((c) => c.name === "Delve");
  const getTeam = useTeamLookup(currentEvent, users);
  const delveLadderColumns = useMemo(() => {
    if (!currentEvent) {
      return [];
    }
    let columns: ColumnDef<LadderEntry>[];
    if (!isMobile) {
      columns = [
        delveDepthColumn({ showProgressive: true }),
        accountColumn(),
        characterColumn(currentEvent),
        teamColumn(currentEvent, getTeam),
        ascendancyColumn(currentEvent),
        levelColumn(),
      ];
    } else {
      columns = [
        delveDepthColumn({ showProgressive: false }),
        mobilePortraitColumn(currentEvent, getTeam, {
          id: "Character",
          searchText: (row) =>
            row.poe_account + row.character_name + row.ascendancy,
          placeholder: "Character",
          size: windowWidth - 100,
          enableSorting: true,
        }),
      ];
    }
    return columns;
  }, [isMobile, currentEvent, getTeam, windowWidth]);

  if (!category) {
    return <></>;
  }
  const fossilRaceCategory = category.children.find(
    (c) => c.name === "Fossil Fuel Race",
  );
  const cumulativeDepthTotal = category.children.find(
    (o) => o.name === "Cumulative Depth",
  );
  const delveRace = category.children.find((c) => c.name === "Delve Race");
  const delvePastLimit = category.children.find(
    (c) => c.name === "Cumulative Depth past 7500",
  );
  if (delvePastLimit) {
    // hacky but who cares
    delvePastLimit.required_number = 2500;
    for (const teamId in delvePastLimit.team_score) {
      delvePastLimit.team_score[teamId].number = () =>
        Math.max(
          (cumulativeDepthTotal?.team_score[teamId].number() || 0) - 7500,
          0,
        );
      delvePastLimit.team_score[teamId].maxNumber = () =>
        Math.max(
          (cumulativeDepthTotal?.team_score[teamId].maxNumber() || 0) - 7500,
          0,
        );
    }
  }
  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">
            <DelveTabRules />
          </article>
        </div>
      ) : null}
      <div className="flex flex-col gap-3">
        <TeamScoreDisplay objective={category} />
        <div className="flex justify-center gap-4">
          {delveRace && (
            <ObjectiveCard objective={delveRace} className="w-100" />
          )}
          {delvePastLimit && (
            <ObjectiveCard objective={delvePastLimit} className="w-100" />
          )}
        </div>
        {fossilRaceCategory ? (
          <div className="rounded-box bg-base-200 p-8 pt-2">
            <div className="divider divider-primary">Fossil Fuel Race</div>
            <Ranking
              objective={fossilRaceCategory}
              description="Fuel:"
              actual={(teamId: number) =>
                fossilRaceCategory.team_score[teamId].number()
              }
              maximum={fossilRaceCategory.required_number}
            />
            <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fossilRaceCategory.children.map((objective) => {
                return (
                  <div className="card bg-base-300" key={objective.id}>
                    <div className="m-0 flex rounded-t-box bg-base-100 p-2 px-4">
                      <ObjectiveIcon
                        objective={objective}
                        gameVersion={currentEvent.game_version}
                        className="size-8"
                      />

                      <h3 className="mx-4 grow text-center text-xl font-semibold">
                        {objective.name}{" "}
                        {objective.tracked_value ===
                        TrackedValue.FOSSIL_FUEL_HIGH
                          ? "x10"
                          : objective.tracked_value ===
                              TrackedValue.FOSSIL_FUEL_MID
                            ? "x2"
                            : "x1"}
                      </h3>
                    </div>
                    <div className="rounded-b-box">
                      <CollectionCardTable objective={objective} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {cumulativeDepthTotal ? (
          <div className="rounded-box bg-base-200 px-0 py-4 sm:px-8 sm:pt-2 sm:pb-8">
            <div className="divider divider-primary">
              {"Cumulative Team Depth"}
            </div>
            <div className="flex flex-col gap-4">
              <Ranking
                objective={cumulativeDepthTotal}
                maximum={cumulativeDepthTotal.required_number}
                actual={(teamId: number) =>
                  cumulativeDepthTotal.team_score[teamId].number()
                }
                description="Depth:"
              />
              <VirtualizedTable
                columns={delveLadderColumns}
                data={
                  ladder?.sort((a, b) => b.delve_depth - a.delve_depth) || []
                }
                className="h-[70vh]"
                styles={{
                  header: "bg-base-100",
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
