import { Event, LadderEntry, Team } from "@api";
import { useMemo } from "react";

export function useTeamLookup(
  event: Event | undefined,
  users: { id: number; team_id: number }[] | undefined,
): (userId: number | undefined) => Team | undefined {
  const teamMap = useMemo(
    () =>
      event?.teams?.reduce((acc: { [teamId: number]: Team }, team) => {
        acc[team.id] = team;
        return acc;
      }, {}) || {},
    [event],
  );
  return useMemo(() => {
    const userToTeam: { [userId: number]: Team } = {};
    for (const user of users ?? []) {
      userToTeam[user.id] = teamMap[user.team_id];
    }
    return (userId) => (userId === undefined ? undefined : userToTeam[userId]);
  }, [users, teamMap]);
}

export function useRankedLadder(unsortedLadder: LadderEntry[] | undefined) {
  return useMemo(
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
}
