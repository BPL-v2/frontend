import { GlobalStateContext } from "@utils/context-provider";
import { useContext, useMemo, useState } from "react";
import { defaultPreferences } from "@mytypes/preferences";
import { twMerge } from "tailwind-merge";
import { MultiSelectPercentage } from "@components/form/multi-select-percentage";
import {
  Event,
  LadderEntry,
  Team,
  useGetItemMapping,
  useGetLadder,
  useGetStreams,
  useGetUsers,
} from "@api";
import {
  ACTIVE_THRESHOLD_SECONDS,
  ActivityDot,
  LadderPortrait,
} from "@components/character/ladder-portrait";
import VirtualizedTable from "@components/table/virtualized-table";
import Select from "@components/form/select";
import { CellContext, ColumnDef, sortingFns } from "@components/table/react-table-shim";
import { totalPoPoints } from "@utils/personal-points";
import { ExperienceBar } from "@components/character/experience-bar";
import { AscendancyName } from "@components/character/ascendancy-name";
import { AscendancyPortrait } from "@components/character/ascendancy-portrait";
import { TeamName } from "@components/team/team-name";
import { Link } from "@tanstack/react-router";
import { TwitchFilled } from "@icons/twitch";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { getSkillColor } from "@utils/gems";

function hoursToDaysAndHours(hours: number) {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days > 0 ? days + " day" : ""}${days > 1 ? "s" : ""} ${remainingHours} hours`;
}
function getTimeSelectOptions(currentEvent: Event) {
  const eventStart = new Date(currentEvent.event_start_time);
  let eventEnd = new Date(currentEvent.event_end_time);
  const now = new Date();
  if (
    isNaN(eventStart.getTime()) ||
    isNaN(eventEnd.getTime()) ||
    now < eventStart
  ) {
    return [];
  }
  if (now < eventEnd) {
    eventEnd = now;
  }
  const hours = Math.ceil(
    (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60),
  );
  return [...Array(Math.ceil((hours + 1) / 2))].map((_, i) => ({
    label: hoursToDaysAndHours(2 * i),
    value: 2 * i,
  }));
}

export function LadderDisplay() {
  const { currentEvent, isMobile, preferences, setPreferences } =
    useContext(GlobalStateContext);
  const { itemMapping = {} } = useGetItemMapping();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { data: users = [], isError: usersIsError } = useGetUsers(
    currentEvent.id,
  );
  const { streams = [] } = useGetStreams(currentEvent.id);

  const [filterActive, setFilterActive] = useState(false);
  const [hoursAfterEventStart, setHoursAfterEventStart] = useState<number>();
  const { data: unsortedLadder, isError: ladderIsError } = useGetLadder(
    currentEvent.id,
    hoursAfterEventStart,
  );
  const ladder = useMemo(() => {
    return (
      unsortedLadder
        ?.slice()
        .sort((a, b) => {
          if (b.level === a.level) {
            return (b.xp || 0) - (a.xp || 0);
          }
          return b.level - a.level;
        })
        .map((entry, index) => ({ ...entry, rank: index + 1 })) || []
    );
  }, [unsortedLadder]);
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

  const filteredLadder = useMemo(() => {
    if (!ladder) {
      return [];
    }
    const now = Date.now() / 1000;
    return ladder.filter((entry) => {
      if (
        filterActive &&
        !(
          entry.last_active > 0 &&
          now - entry.last_active < ACTIVE_THRESHOLD_SECONDS
        )
      ) {
        return false;
      }
      for (const itemIdx of selectedItems) {
        if (!entry.item_indexes?.includes(itemIdx)) {
          return false;
        }
      }
      return true;
    });
  }, [ladder, selectedItems, filterActive]);

  const showAlwaysLadder = ["Stream"];

  const percentagePlayersWithItem = useMemo(
    () =>
      filteredLadder?.reduce(
        (acc, entry) => {
          for (const skill of entry.item_indexes || []) {
            acc[skill] = (acc[skill] || 0) + 1 / (filteredLadder?.length || 1);
          }
          return acc;
        },
        {} as { [skillId: number]: number },
      ) || {},
    [filteredLadder],
  );
  const streamsByUser = streams.reduce(
    (acc, stream) => {
      if (stream.backend_user_id) {
        acc[stream.backend_user_id] = stream;
      }
      return acc;
    },
    {} as { [userId: number]: (typeof streams)[0] },
  );
  const userMap = useMemo(
    () =>
      users?.reduce((acc: { [userId: number]: (typeof users)[0] }, user) => {
        acc[user.id] = user;
        return acc;
      }, {}) || {},
    [users],
  );

  const ladderColumns = useMemo(() => {
    if (!currentEvent) {
      return [];
    }
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
          id: "Stream",
          header: "",
          cell: (info) =>
            streamsByUser[info.row.original.user_id || 0] &&
            info.row.original.twitch_name && (
              <Link
                to={"/streams/$twitchAccount"}
                params={{
                  twitchAccount: info.row.original.twitch_name || "",
                }}
              >
                <TwitchFilled className="size-5" brandColor />
              </Link>
            ),
          enableSorting: false,
          size: 30,
          meta: {
            filterVariant: "boolean",
          },
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
          id: "Discord",
          accessorFn: (row) => {
            if (!row.user_id) return "";
            const user = userMap[row.user_id];
            if (!user || !user.discord_name || !user.discord_id) return "";
            return user.discord_name + `#` + user.discord_id;
          },
          header: "",
          cell: (info) => {
            const user = userMap[info.row.original.user_id || 0];
            if (!user || !user.discord_name || !user.discord_id) {
              return "null";
            }
            return (
              <div className="flex items-center gap-2">
                <ClipboardDocumentListIcon
                  className="size-6 transition-transform duration-100 select-none hover:cursor-pointer hover:text-primary active:scale-110 active:text-secondary"
                  onClick={() =>
                    navigator.clipboard.writeText("<@" + user.discord_id + "> ")
                  }
                />
                {user.discord_name}
              </div>
            );
          },
          enableSorting: false,
          size: 200,
          filterFn: "includesString",
          meta: {
            filterVariant: "string",
            filterPlaceholder: "Discord",
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
            align: "left",
            filterVariant: "string",
            filterPlaceholder: "Character",
          },
          cell: (info) => (
            <Link
              to={"/profile/$userId/$eventId/$characterId"}
              className="flex items-start gap-1 hover:text-primary"
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
          cell: (info) => {
            return (
              <div className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <AscendancyPortrait
                    character_class={info.row.original.ascendancy}
                    game_version={currentEvent.game_version}
                    className="size-10 rounded-full object-cover"
                  />
                  <ActivityDot
                    last_active={info.row.original.last_active}
                    className="absolute top-0 right-0 size-2.5"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={getSkillColor(info.row.original.main_skill)}>
                    {info.row.original.main_skill}
                  </span>
                  <AscendancyName
                    character_class={info.row.original.ascendancy}
                    game_version={currentEvent.game_version}
                  />
                </div>
              </div>
            );
          },
          size: 300,
          filterFn: "includesString",
          enableSorting: false,
          meta: {
            align: "left",
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
          sortFn: sortingFns.basic,
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
                className="tooltip tooltip-bottom overflow-hidden text-ellipsis"
                data-tip={stat}
              >
                <span>{stat}</span>
              </div>
            ),
            cell: (info: CellContext<LadderEntry, unknown>) => {
              const value = info.getValue<number>();
              if (value === undefined) {
                return 0;
              }
              if (value === 2147483647) {
                return "inf";
              }
              return value.toLocaleString();
            },
            size: 110,
            sortFn: sortingFns.basic,
            meta: {
              filterVariant: "number",
            },
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
          meta: {
            filterVariant: "boolean",
          },
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
          meta: {
            filterVariant: "boolean",
          },
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
              event={currentEvent}
            />
          ),
          enableSorting: false,
          size: 375,
        },
      ];
    }
    return columns.filter((col) => {
      return (
        isMobile ||
        preferences.ladder[col.id as keyof typeof preferences.ladder] ||
        showAlwaysLadder.includes(col.id as string)
      );
    });
  }, [isMobile, currentEvent, preferences, userMap, streamsByUser, getTeam]);

  if (ladderIsError || usersIsError) {
    return (
      <div className="alert alert-error">
        <div>
          <span>Error loading ladder data.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="divider divider-primary">Ladder</div>
      <div className="flex flex-col gap-2">
        {!isMobile && (
          <div className="flex flex-wrap justify-between gap-1">
            {Object.keys(defaultPreferences.ladder).map((label) => {
              const key = label as keyof typeof preferences.ladder;
              return (
                <button
                  key={label}
                  onClick={() => {
                    setPreferences({
                      ...preferences,
                      ladder: {
                        ...preferences.ladder,
                        [label]: !preferences.ladder[key],
                      },
                    });
                  }}
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
        <div className="flex flex-col gap-2 px-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <MultiSelectPercentage
              name="uniques"
              options={Object.entries(itemMapping["unique"] || {}).map(
                ([name, idx]) => ({
                  label: name,
                  value: idx,
                }),
              )}
              onChange={setSelectedItems}
              placeholder="Filter by uniques"
              percentages={percentagePlayersWithItem}
              values={selectedItems}
              className="w-full md:w-100"
            />
            <MultiSelectPercentage
              name="skills"
              options={Object.entries(itemMapping["gem"] || {}).map(
                ([skill, idx]) => ({
                  label: skill,
                  value: idx,
                }),
              )}
              onChange={setSelectedItems}
              placeholder="Filter by gem"
              percentages={percentagePlayersWithItem}
              values={selectedItems}
              className="w-full md:w-100"
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={filterActive}
                onChange={(e) => setFilterActive(e.target.checked)}
              />
              Active only
            </label>
          </div>
          {getTimeSelectOptions(currentEvent).length > 0 && (
            <Select
              className="w-full md:w-auto"
              placeholder="Show ladder at..."
              options={getTimeSelectOptions(currentEvent)}
              onChange={(value: unknown) => {
                setHoursAfterEventStart(value as number);
              }}
            />
          )}
        </div>
        <VirtualizedTable
          data={filteredLadder?.sort((a, b) => a.rank - b.rank) || []}
          columns={ladderColumns}
          className="h-[70vh]"
        />
      </div>
    </div>
  );
}
