import {
  accountColumn,
  ascendancyColumn,
  characterColumn,
  levelColumn,
  mobilePortraitColumn,
  progressColumns,
  discordColumn,
  rankColumn,
  streamColumn,
  teamColumn,
} from "@components/ladder/ladder-columns";
import { useTeamLookup, useRankedLadder } from "@utils/ladder-hooks";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext, useMemo, useState } from "react";
import { defaultPreferences } from "@mytypes/preferences";
import { twMerge } from "tailwind-merge";
import { MultiSelectPercentage } from "@components/form/multi-select-percentage";
import {
  Event,
  LadderEntry,
  useGetItemMapping,
  useGetLadder,
  useGetStreams,
  useGetUsers,
} from "@api";
import { ACTIVE_THRESHOLD_SECONDS } from "@components/character/ladder-portrait";
import VirtualizedTable from "@components/table/virtualized-table";
import Select from "@components/form/select";
import { ColumnDef } from "@components/table/react-table-shim";

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
  const ladder = useRankedLadder(unsortedLadder);
  const getTeam = useTeamLookup(currentEvent, users);

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
    let columns: ColumnDef<LadderEntry>[];
    if (!isMobile) {
      columns = [
        rankColumn(),
        streamColumn(streamsByUser),
        accountColumn(),
        discordColumn(userMap),
        characterColumn(currentEvent),
        teamColumn(currentEvent, getTeam),
        ascendancyColumn(currentEvent),
        levelColumn(),
        ...progressColumns(),
      ];
    } else {
      columns = [
        mobilePortraitColumn(currentEvent, getTeam, {
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
