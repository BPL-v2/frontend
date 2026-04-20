import { Event, LadderEntry, Team } from "@api";
import {
  useGetEvents,
  useGetItemMapping,
  useGetLadder,
  useGetRules,
  useGetScore,
  useGetUsers,
} from "@api";
import { AscendancyName } from "@components/character/ascendancy-name";
import { AscendancyPortrait } from "@components/character/ascendancy-portrait";
import { ExperienceBar } from "@components/character/experience-bar";
import { LadderPortrait } from "@components/character/ladder-portrait";
import { MultiSelectPercentage } from "@components/form/multi-select-percentage";
import Select from "@components/form/select";
import Table from "@components/table/table";
import VirtualizedTable from "@components/table/virtualized-table";
import TeamScoreDisplay from "@components/team/team-score";
import { TeamName } from "@components/team/team-name";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { defaultPreferences } from "@mytypes/preferences";
import { CellContext, ColumnDef, sortingFns } from "@tanstack/react-table";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { getSkillColor } from "@utils/gems";
import { totalPoPoints } from "@utils/personal-points";
import { renderScore } from "@utils/score";
import { hidePOTotal, mergeScores, getTotalPoints } from "@utils/utils";
import { JSX, useContext, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/events/$eventId")({
  component: EventPage,
});

type RowDef = {
  total: number;
  team: Team;
  key: string;
  [category: string]: number | Team | string;
};

function hoursToDaysAndHours(hours: number) {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days > 0 ? days + " day" : ""}${days > 1 ? "s" : ""} ${remainingHours} hours`;
}

function getTimeSelectOptions(event: Event) {
  const eventStart = new Date(event.event_start_time);
  const eventEnd = new Date(event.event_end_time);
  if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) {
    return [];
  }
  const hours = Math.ceil(
    (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60),
  );
  return [...Array(Math.ceil((hours + 1) / 2))].map((_, i) => ({
    label: hoursToDaysAndHours(2 * i),
    value: 2 * i,
  }));
}

function EventPage(): JSX.Element {
  const { eventId: eventIdParam } = Route.useParams();
  const eventId = Number(eventIdParam);
  const { isMobile, preferences, setPreferences } =
    useContext(GlobalStateContext);
  const [hoursAfterEventStart, setHoursAfterEventStart] = useState<number>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const { events = [] } = useGetEvents();
  const event = events.find((e) => e.id === eventId);

  const { rules } = useGetRules(eventId);
  const { score: rawScore } = useGetScore(eventId);
  const { data: unsortedLadder, isError: ladderIsError } = useGetLadder(
    eventId,
    hoursAfterEventStart,
  );
  const { data: users = [], isError: usersIsError } = useGetUsers(eventId);
  const { itemMapping = {} } = useGetItemMapping();

  const scores = useMemo(() => {
    if (!rules || !rawScore || !event) return undefined;
    return hidePOTotal(
      mergeScores(
        rules,
        rawScore,
        event.teams.map((t) => t.id),
      ),
    );
  }, [rules, rawScore, event]);

  const ladder = useMemo(
    () =>
      unsortedLadder
        ?.slice()
        .sort((a, b) => {
          if (b.level === a.level) return (b.xp || 0) - (a.xp || 0);
          return b.level - a.level;
        })
        .map((entry, index) => ({ ...entry, rank: index + 1 })) || [],
    [unsortedLadder],
  );

  const filteredLadder = useMemo(() => {
    if (selectedItems.length === 0) return ladder;
    return ladder.filter((entry) =>
      selectedItems.every((idx) => entry.item_indexes?.includes(idx)),
    );
  }, [ladder, selectedItems]);

  const percentagePlayersWithItem = useMemo(
    () =>
      filteredLadder.reduce(
        (acc, entry) => {
          for (const skill of entry.item_indexes || []) {
            acc[skill] = (acc[skill] || 0) + 1 / (filteredLadder.length || 1);
          }
          return acc;
        },
        {} as { [skillId: number]: number },
      ),
    [filteredLadder],
  );

  const teamMap = useMemo(
    () =>
      event?.teams.reduce((acc: { [teamId: number]: Team }, team) => {
        acc[team.id] = team;
        return acc;
      }, {}) || {},
    [event],
  );

  const userMap = useMemo(
    () =>
      users.reduce((acc: { [userId: number]: (typeof users)[0] }, user) => {
        acc[user.id] = user;
        return acc;
      }, {}),
    [users],
  );

  const getTeam = useMemo(() => {
    const userToTeam =
      users.reduce(
        (acc, user) => {
          acc[user.id] = teamMap[user.team_id];
          return acc;
        },
        {} as { [userId: number]: Team },
      ) || {};
    return (userId: number | undefined): Team | undefined => {
      if (userId === undefined) return undefined;
      return userToTeam[userId];
    };
  }, [users, teamMap]);

  const ladderColumns = useMemo(() => {
    if (!event) return [];
    let columns: ColumnDef<LadderEntry>[] = [];
    if (!isMobile) {
      columns = [
        {
          id: "Rank",
          accessorKey: "rank",
          header: "#",
          size: 50,
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
                eventId: event.id,
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
            options: event.teams.map((team) => team.name),
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
          id: "Level",
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
        {
          id: "Delve",
          accessorKey: "delve",
          header: "Delve",
          size: 100,
        },
        ...[
          "DPS",
          "EHP",
          "Armour",
          "Evasion",
          "ES",
          "Ele max hit",
          "Phys max hit",
          "HP",
          "Mana",
          "Movement Speed",
        ].map((stat) => {
          const key = stat
            .replaceAll(" ", "_")
            .toLowerCase() as keyof LadderEntry;
          return {
            id: stat,
            accessorFn: (row: LadderEntry) => row[key] || 0,
            header: () => (
              <div
                className="tooltip tooltip-bottom w-18 overflow-hidden text-ellipsis"
                data-tip={stat}
              >
                <span>{stat}</span>
              </div>
            ),
            cell: (info: CellContext<LadderEntry, unknown>) => {
              const value = info.getValue<number>();
              if (value === undefined) return 0;
              if (value === 2147483647) return "inf";
              return value.toLocaleString();
            },
            size: 100,
            sortingFn: sortingFns.basic,
            meta: { filterVariant: "number" },
          };
        }),
        {
          id: "P.O.",
          header: "P.O.",
          accessorFn: (row) => totalPoPoints(row),
          cell: (info) => info.getValue(),
          size: 90,
        },
        {
          id: "Pantheon",
          header: "Pantheon",
          accessorFn: (row) => row.pantheon,
          cell: (info) =>
            info.row.original.pantheon ? (
              <CheckCircleIcon className="size-6 text-success" />
            ) : (
              <XCircleIcon className="size-6 text-error" />
            ),
          enableSorting: false,
          meta: { filterVariant: "boolean" },
        },
        {
          id: "Uber Lab",
          accessorFn: (row) => (row.ascendancy_points || 0) > 6,
          cell: (info) =>
            (info.row.original.ascendancy_points || 0) > 6 ? (
              <CheckCircleIcon className="size-6 text-success" />
            ) : (
              <XCircleIcon className="size-6 text-error" />
            ),
          enableSorting: false,
          header: "Uber Lab",
          meta: { filterVariant: "boolean" },
        },
        {
          id: "Atlas",
          accessorFn: (row) => row.atlas_points || 0,
          header: "Atlas",
        },
      ];
    } else {
      columns = [
        {
          accessorFn: (row) =>
            row.poe_account +
            row.character_name +
            row.ascendancy +
            row.main_skill,
          header: " ",
          filterFn: "includesString",
          meta: {
            filterVariant: "string",
            filterPlaceholder: "Search",
          },
          cell: (info) => (
            <LadderPortrait
              entry={info.row.original}
              team={getTeam(info.row.original.user_id)}
            />
          ),
          enableSorting: false,
          size: 375,
        },
      ];
    }
    return columns.filter(
      (col) =>
        isMobile ||
        preferences.ladder[col.id as keyof typeof preferences.ladder] ||
        col.id === "Rank",
    );
  }, [isMobile, event, preferences, userMap, getTeam]);

  const categoryNames = scores?.children.map((c) => c.name) || [];
  const scoreRows = (event?.teams || []).map((team) => ({
    team,
    key: team.id.toString(),
    total: getTotalPoints(scores)[team.id] || 0,
    ...Object.fromEntries(
      categoryNames.map((name) => {
        const child = scores?.children.find((c) => c.name === name);
        return [name, child ? getTotalPoints(child)[team.id] || 0 : 0];
      }),
    ),
  })) as RowDef[];

  const scoreColumns: ColumnDef<RowDef>[] = [
    {
      accessorKey: "team.name",
      header: "Team",
      cell: ({ row }) => (
        <TeamName className="font-semibold" team={row.original?.team} />
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) =>
        renderScore(row.original.total, undefined, event?.uses_medals),
    },
    ...categoryNames.map((name) => ({
      header: name === "Personal Objectives" ? "P.O." : name,
      accessorKey: name,
      key: `column-${name}`,
      // @ts-ignore: dynamic key access on typed row
      cell: ({ row }) =>
        renderScore(
          (row.original[name] as number) || 0,
          undefined,
          event?.uses_medals,
        ),
    })),
  ];

  if (!event) {
    return (
      <div className="mx-auto mt-8 flex flex-col gap-8">
        <div className="card bg-card">
          <div className="card-body p-12">
            <div className="text-xl opacity-60">Loading event...</div>
          </div>
        </div>
      </div>
    );
  }

  if (ladderIsError || usersIsError) {
    return (
      <div className="mt-8 alert alert-error">
        <span>Error loading event data.</span>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 flex flex-col gap-8">
      <div className="card bg-card">
        <div className="card-body p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{event.name}</h1>
              <div className="mt-1 opacity-60">
                {new Date(event.event_start_time).toLocaleDateString()} –{" "}
                {new Date(event.event_end_time).toLocaleDateString()}
              </div>
            </div>
            <Link to="/events" className="btn btn-ghost btn-sm">
              ← All Events
            </Link>
          </div>
        </div>
      </div>

      {isMobile ? (
        <TeamScoreDisplay objective={scores} />
      ) : (
        <>
          <div className="divider divider-primary">Team Scores</div>
          <Table
            data={scoreRows.sort((a, b) => b.total - a.total)}
            columns={scoreColumns}
            className="max-h-[30vh]"
          />
        </>
      )}

      <div className="divider divider-primary">Ladder</div>
      <div className="flex flex-col gap-2">
        {!isMobile && (
          <div className="flex flex-wrap justify-between gap-1">
            {Object.keys(defaultPreferences.ladder).map((label) => {
              const key = label as keyof typeof preferences.ladder;
              return (
                <button
                  key={label}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      ladder: {
                        ...preferences.ladder,
                        [label]: !preferences.ladder[key],
                      },
                    })
                  }
                  className={twMerge(
                    "btn rounded-lg px-2 btn-sm",
                    preferences.ladder[key]
                      ? "btn-primary"
                      : "border-primary bg-base-100/0 text-primary",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <MultiSelectPercentage
              name="uniques"
              options={Object.entries(itemMapping["unique"] || {}).map(
                ([name, idx]) => ({ label: name, value: idx }),
              )}
              onChange={setSelectedItems}
              placeholder="Filter by uniques"
              percentages={percentagePlayersWithItem}
              values={selectedItems}
              className="w-100"
            />
            <MultiSelectPercentage
              name="skills"
              options={Object.entries(itemMapping["gem"] || {}).map(
                ([skill, idx]) => ({ label: skill, value: idx }),
              )}
              onChange={setSelectedItems}
              placeholder="Filter by gem"
              percentages={percentagePlayersWithItem}
              values={selectedItems}
              className="w-100"
            />
          </div>
          <Select
            className=""
            placeholder="Show ladder at..."
            options={getTimeSelectOptions(event)}
            onChange={(value: unknown) =>
              setHoursAfterEventStart(value as number)
            }
          />
        </div>
        <VirtualizedTable
          data={filteredLadder.sort((a, b) => a.rank - b.rank)}
          columns={ladderColumns}
          className="h-[70vh]"
        />
      </div>
    </div>
  );
}
