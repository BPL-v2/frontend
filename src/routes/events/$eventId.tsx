import {
  accountColumn,
  ascendancyColumn,
  characterColumn,
  levelColumn,
  mobilePortraitColumn,
  progressColumns,
  rankColumn,
  teamColumn,
} from "@components/ladder/ladder-columns";
import { useTeamLookup, useRankedLadder } from "@utils/ladder-hooks";
import { Event, LadderEntry, Team } from "@api";
import {
  useGetEvents,
  useGetItemMapping,
  useGetLadder,
  useGetRules,
  useGetScore,
  useGetUsers,
} from "@api";
import { MultiSelectPercentage } from "@components/form/multi-select-percentage";
import Select from "@components/form/select";
import Table from "@components/table/table";
import VirtualizedTable from "@components/table/virtualized-table";
import TeamScoreDisplay from "@components/team/team-score";
import { TeamName } from "@components/team/team-name";
import { defaultPreferences } from "@mytypes/preferences";
import { ColumnDef } from "@components/table/react-table-shim";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { Score } from "@components/score";
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

  const ladder = useRankedLadder(unsortedLadder);

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

  const getTeam = useTeamLookup(event, users);

  const ladderColumns = useMemo(() => {
    if (!event) return [];
    let columns: ColumnDef<LadderEntry>[];
    if (!isMobile) {
      columns = [
        rankColumn(),
        accountColumn(),
        characterColumn(event),
        teamColumn(event, getTeam),
        ascendancyColumn(event),
        levelColumn(),
        ...progressColumns(),
      ];
    } else {
      columns = [
        mobilePortraitColumn(event, getTeam, {
          searchText: (row) =>
            row.poe_account +
            row.character_name +
            row.ascendancy +
            row.main_skill,
          placeholder: "Search",
          size: 375,
        }),
      ];
    }
    return columns.filter(
      (col) =>
        isMobile ||
        preferences.ladder[col.id as keyof typeof preferences.ladder] ||
        col.id === "Rank",
    );
  }, [isMobile, event, preferences, getTeam]);

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
      meta: { align: "left" },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <Score
          actualNumberOfPoints={row.original.total}
          potentialNumberOfPoints={undefined}
          usesMedals={event?.uses_medals}
        />
      ),
    },
    ...categoryNames.map((name) => ({
      header: name === "Personal Objectives" ? "P.O." : name,
      accessorKey: name,
      key: `column-${name}`,
      // @ts-ignore: dynamic key access on typed row
      cell: ({ row }) => (
        <Score
          actualNumberOfPoints={(row.original[name] as number) || 0}
          potentialNumberOfPoints={undefined}
          usesMedals={event?.uses_medals}
        />
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
