import { createFileRoute, Link } from "@tanstack/react-router";

import { Permission, Signup } from "@api";
import { renderConditionally } from "@utils/token";
import { useContext } from "react";
import {
  useGetActivitiesForEvent,
  useGetLadder,
  useGetSignups,
  useGetUsers,
} from "@api";
import { GlobalStateContext } from "@utils/context-provider";
import VirtualizedTable from "@components/table/virtualized-table";
import { getTotalPoints } from "@utils/utils";

export const Route = createFileRoute("/admin/activity/")({
  component: renderConditionally(ActivityPage, [Permission.admin]),
});
const degenHours = 14;
function ActivityPage() {
  const { currentEvent, scores } = useContext(GlobalStateContext);
  const { activities } = useGetActivitiesForEvent(currentEvent?.id);
  const { users = [] } = useGetUsers(currentEvent.id);
  const { ladder = [] } = useGetLadder(currentEvent.id);
  const { signups = [] } = useGetSignups(currentEvent.id);
  if (
    !activities ||
    !users ||
    !ladder ||
    !signups ||
    !currentEvent.event_start_time ||
    !currentEvent.event_end_time
  ) {
    return <div>Loading...</div>;
  }

  const signupMap = signups.reduce(
    (map, signup) => {
      map[String(signup.user.id)] = signup;
      return map;
    },
    {} as Record<string, (typeof signups)[0]>,
  );
  const pointMap = getTotalPoints(scores);
  const userMap = users.reduce(
    (map, user) => {
      map[String(user.id)] = { user: user, signup: signupMap[String(user.id)] };
      return map;
    },
    {} as Record<
      string,
      {
        user: {
          team_id: number;
          discord_id?: string;
          discord_name?: string;
          display_name: string;
          id: number;
          poe_account_name?: string;
        };
        signup: Signup;
      }
    >,
  );
  const ladderMap = ladder.reduce(
    (map, entry) => {
      map[String(entry.user_id)] = entry;
      return map;
    },
    {} as Record<string, (typeof ladder)[0]>,
  );
  const userActivities = [];
  for (const [userId, activeMilliseconds] of Object.entries(activities)) {
    const user = userMap[userId].user;
    if (user) {
      userActivities.push({
        name: user.display_name,
        id: user.id,
        activeHours: activeMilliseconds / (1000 * 60 * 60),
        ladderEntry: ladderMap[userId],
        teamId: user.team_id,
        duo: !!userMap[userId].signup?.group,
      });
    }
  }
  const end = Math.min((currentEvent.event_end_time.getTime(), Date.now()));
  const durationOfEventHours =
    (end - currentEvent.event_start_time.getTime()) / 3600 / 1000;
  console.log("durationOfEventHours", durationOfEventHours);
  const teamTableData = userActivities.reduce(
    (map, activity) => {
      const teamId = activity.teamId as number;
      if (!map[teamId]) {
        map[teamId] = {
          totalActiveHours: 0,
          activeMembers: 0,
          degens: 0,
          teamId: teamId,
          totalActiveDuoHours: 0,
          numberDuoMembers: 0,
        };
      }
      map[teamId].totalActiveHours += activity.activeHours;
      map[teamId].totalActiveDuoHours += activity.duo
        ? activity.activeHours
        : 0;
      map[teamId].numberDuoMembers += activity.duo ? 1 : 0;
      map[teamId].activeMembers += 1;
      if (activity.activeHours > (degenHours * durationOfEventHours) / 24) {
        map[teamId].degens += 1;
      }
      return map;
    },
    {} as Record<
      string,
      {
        teamId: number;
        totalActiveHours: number;
        activeMembers: number;
        degens: number;
        totalActiveDuoHours: number;
        numberDuoMembers: number;
      }
    >,
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      <VirtualizedTable
        data={Object.values(teamTableData)}
        columns={[
          {
            header: "Team",
            accessorKey: "teamId",
            cell: (info) =>
              currentEvent.teams.find((t) => t.id === info.getValue())?.name,

            size: 200,
          },
          {
            header: "Points",
            accessorFn: (row) => pointMap[row.teamId] || 0,
            size: 100,
          },
          {
            header: "Active Members",
            accessorKey: "activeMembers",
            size: 200,
          },
          {
            header: `${degenHours}h+ Players`,
            accessorKey: "degens",
            size: 200,
          },
          {
            header: "Hours/day",
            accessorFn: (row) =>
              row.totalActiveHours /
              row.activeMembers /
              (durationOfEventHours / 24),
            cell: (info) => (info.getValue() as number).toFixed(2),
            size: 150,
          },
          {
            header: "Total Active Hours",
            accessorKey: "totalActiveHours",
            cell: (info) => Math.round(info.getValue() as number),
            size: 200,
          },
          {
            header: "Duo Hours/day",
            accessorKey: "numberDuoMembers",
            accessorFn: (row) =>
              row.numberDuoMembers > 0
                ? row.totalActiveDuoHours /
                  row.numberDuoMembers /
                  durationOfEventHours
                : 0,
            cell: (info) => (info.getValue() as number).toFixed(2),
            size: 150,
          },
        ]}
      />

      <VirtualizedTable
        className="max-h-[70vh]"
        data={userActivities.sort((a, b) => b.activeHours - a.activeHours)}
        columns={[
          {
            header: "User",
            accessorKey: "name",
            cell: (info) => (
              <Link
                to={`/profile/$userId`}
                params={{
                  userId: info.row.original.id,
                }}
              >
                {info.getValue() as string}
              </Link>
            ),
            size: 250,
          },
          {
            header: "Graph",
            id: "graph",
            cell: (info) => (
              <Link
                to="/admin/activity/$userId"
                params={{ userId: String(info.row.original.id) }}
              >
                View
              </Link>
            ),
            size: 100,
          },
          {
            header: "Level",
            accessorKey: "ladderEntry.level",
            size: 100,
          },
          {
            header: "Character",
            accessorKey: "ladderEntry",
            cell: (info) => {
              const entry = info.getValue() as (typeof ladder)[0] | undefined;
              if (!entry || !entry.user_id) {
                return "";
              }
              return (
                <Link
                  to={`/profile/$userId`}
                  params={{
                    userId: entry.user_id,
                  }}
                  className=""
                  target="_blank"
                >
                  {entry.character_name}
                </Link>
              );
            },
            size: 250,
          },
          {
            header: "Active Hours",
            accessorKey: "activeHours",
            id: "activeHours",
            cell: (info) => (info.getValue() as number).toFixed(2),
          },
          {
            header: "Hours/day",
            accessorKey: "activeHours",
            id: "hoursPerDay",
            cell: (info) =>
              (
                (info.getValue() as number) /
                (durationOfEventHours / 24)
              ).toFixed(2),
          },
          {
            header: "Percentage Active",
            accessorKey: "activeHours",
            id: "percentageActive",
            cell: (info) =>
              (
                ((info.getValue() as number) / durationOfEventHours) *
                100
              ).toFixed(2) + "%",
          },
        ]}
      />
    </div>
  );
}

export default ActivityPage;
