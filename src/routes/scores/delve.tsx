import { LadderEntry, Team } from "@api";
import { preloadLadderData, useGetLadder, useGetUsers } from "@api";
import { AscendancyName } from "@components/character/ascendancy-name";
import { AscendancyPortrait } from "@components/character/ascendancy-portrait";
import { CollectionCardTable } from "@components/cards/collection-card-table";
import { ExperienceBar } from "@components/character/experience-bar";
import { ObjectiveIcon } from "@components/objective-icon";
import { Ranking } from "@components/ranking";
import VirtualizedTable from "@components/table/virtualized-table";
import { TeamName } from "@components/team/team-name";
import TeamScoreDisplay from "@components/team/team-score";
import { DelveTabRules } from "@rules/delve";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ColumnDef, sortingFns } from "@tanstack/react-table";
import { GlobalStateContext } from "@utils/context-provider";
import { JSX, useContext, useMemo } from "react";
import { LadderPortrait } from "@components/character/ladder-portrait";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { getSkillColor } from "@utils/gems";
import { progressiveDelveDepth } from "@utils/personal-points";

export const Route = createFileRoute("/scores/delve")({
  component: DelveTab,
  // @ts-ignore context is not typed
  loader: async ({ context: { queryClient } }) => {
    preloadLadderData(queryClient);
  },
});

function DelveTab(): JSX.Element {
  const { scores, currentEvent, isMobile } = useContext(GlobalStateContext);
  const { rules } = Route.useSearch();
  const { data: ladder = [] } = useGetLadder(currentEvent.id);
  const { data: users } = useGetUsers(currentEvent.id);
  const category = scores?.children.find((c) => c.name === "Delve");
  const teamMap = useMemo(
    () =>
      currentEvent?.teams?.reduce((acc: { [teamId: number]: Team }, team) => {
        acc[team.id] = team;
        return acc;
      }, {}) || {},
    [currentEvent],
  );
  const getTeam = useMemo(() => {
    const userToTeam =
      users?.reduce(
        (acc, user) => {
          acc[user.id] = teamMap[user.team_id];
          return acc;
        },
        {} as { [userId: number]: Team },
      ) || {};
    return (userId: number | undefined): Team | undefined => {
      if (userId === undefined) {
        return undefined;
      }
      return userToTeam[userId];
    };
  }, [users, teamMap]);
  const delveLadderColumns = useMemo(() => {
    if (!currentEvent) {
      return [];
    }
    let columns: ColumnDef<LadderEntry>[] = [];
    if (!isMobile) {
      columns = [
        {
          accessorKey: "delve_depth",
          header: "Depth",
          sortingFn: sortingFns.basic,
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              {row.original.delve_depth}
              {progressiveDelveDepth(row.original) > 0 && (
                <span className="text-sm text-success">
                  ({progressiveDelveDepth(row.original)})
                </span>
              )}
            </div>
          ),
          size: 100,
        },
        {
          id: "Account",
          accessorKey: "poe_account",
          header: "",
          cell: (info) => (
            <a
              className="flex cursor-pointer items-center gap-1 hover:text-primary"
              href={`https://www.pathofexile.com/account/view-profile/${info.row.original.poe_account.replace("#", "-")}/characters`}
              target="_blank"
            >
              <ArrowTopRightOnSquareIcon className="inline size-4" />
              {info.row.original.poe_account}
            </a>
          ),
          enableSorting: false,
          size: 250,
          filterFn: "includesString",
          meta: {
            filterVariant: "string",
            filterPlaceholder: "Account",
          },
        },
        {
          id: "Character",
          accessorKey: "character_name",
          header: "",
          enableSorting: false,
          size: 250,
          filterFn: "includesString",
          meta: {
            filterVariant: "string",
            filterPlaceholder: "Character",
          },
          cell: (info) => (
            <Link
              to={"/profile/$userId/$eventId/$characterId"}
              className="flex items-center gap-1 hover:text-primary"
              params={{
                userId: info.row.original.user_id || 0,
                characterId: info.row.original.character_id || "",
                eventId: currentEvent.id,
              }}
            >
              <ArrowTopRightOnSquareIcon className="inline size-4" />
              {info.row.original.character_name}
            </Link>
          ),
        },
        {
          id: "Team",
          accessorFn: (row) => getTeam(row.user_id)?.name,
          header: " ",
          cell: (info) => (
            <TeamName team={getTeam(info.row.original.user_id)} />
          ),
          enableSorting: false,
          size: 200,
          filterFn: "includesString",
          meta: {
            filterVariant: "enum",
            filterPlaceholder: "Team",
            options: currentEvent.teams.map((team) => team.name),
          },
        },
        {
          id: "Ascendancy",
          accessorFn: (row) => row.ascendancy + row.main_skill,
          header: "",
          cell: (info) => (
            <div className="flex items-center gap-2">
              <AscendancyPortrait
                character_class={info.row.original.ascendancy}
                className="size-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className={getSkillColor(info.row.original.main_skill)}>
                  {info.row.original.main_skill}
                </span>
                <AscendancyName
                  character_class={info.row.original.ascendancy}
                />
              </div>
            </div>
          ),
          size: 300,
          filterFn: "includesString",
          enableSorting: false,
          meta: {
            filterVariant: "string",
            filterPlaceholder: "Ascendancy / Skill",
          },
        },
        {
          accessorKey: "experience",
          header: "Level",
          cell: (info) => (
            <ExperienceBar
              experience={info.row.original.xp}
              level={info.row.original.level}
              width={60}
              className="text-lg font-bold"
            />
          ),
          sortingFn: sortingFns.basic,
          size: 120,
        },
      ];
    } else {
      columns = [
        {
          accessorKey: "delve_depth",
          header: "Depth",
          sortingFn: sortingFns.basic,
          size: 100,
        },
        {
          id: "Character",
          accessorFn: (row) =>
            row.poe_account + row.character_name + row.ascendancy,
          header: " ",
          filterFn: "includesString",
          meta: {
            filterVariant: "string",
            filterPlaceholder: "Character",
          },
          cell: (info) => (
            <LadderPortrait
              entry={info.row.original}
              team={getTeam(info.row.original.user_id)}
            />
          ),
        },
      ];
    }
    return columns;
  }, [isMobile, currentEvent, getTeam]);

  if (!category) {
    return <></>;
  }
  const fossilRaceCategory = category.children.find(
    (c) => c.name === "Fossil Fuel Race",
  );
  const culmulativeDepthTotal = category.children.find(
    (o) => o.name === "Culmulative Depth",
  );
  console.log("culmulativeDepthTotal", culmulativeDepthTotal);
  console.log(
    "finished",
    Object.entries(culmulativeDepthTotal?.team_score || {}).map(
      ([teamId, score]) => ({ teamId, finished: score.isFinished() }),
    ),
  );
  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">
            <DelveTabRules />
          </article>
        </div>
      ) : null}
      <div className="flex flex-col gap-8">
        <TeamScoreDisplay objective={category} />
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
                        {objective.name}
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

        {culmulativeDepthTotal ? (
          <div className="rounded-box bg-base-200 p-8 pt-2">
            <div className="divider divider-primary">
              {"Culmulative Team Depth"}
            </div>
            <div className="flex flex-col gap-4">
              <Ranking
                objective={culmulativeDepthTotal}
                maximum={culmulativeDepthTotal.required_number}
                actual={(teamId: number) =>
                  culmulativeDepthTotal.team_score[teamId].number()
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
