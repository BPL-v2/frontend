import {
  Permission,
  AchievementResponse,
  MinimalUser,
  useGetAchievements,
  useGetEvents,
  useGetUsers,
  useGrantAchievement,
  useRevokeAchievement,
  useSyncAchievements,
  useGetCharactersForEvent,
  useGetUserAchievements,
} from "@api";
import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import VirtualizedTable from "@components/table/virtualized-table";
import Select from "@components/form/select";
import { createFileRoute } from "@tanstack/react-router";
import { renderConditionally } from "@utils/token";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/grant-achievements")({
  component: renderConditionally(GrantAchievementsPage, [
    Permission.admin,
    Permission.achievement_assigner,
  ]),
});

const BADGE_SHADES = [
  "bg-primary/25",
  "bg-primary/40",
  "bg-primary/55",
  "bg-primary/70",
  "bg-primary/85",
];

function iconDataUrl(achievement: AchievementResponse): string | null {
  if (!achievement.icon) return null;
  return `data:${achievement.icon_mime_type};base64,${achievement.icon}`;
}

type UserRow = MinimalUser & {
  team_id: number;
  team_name: string;
  character_name: string;
  character_id: string | null;
  existing_achievements: AchievementResponse[];
};

function GrantAchievementsPage() {
  const qc = useQueryClient();
  const { events } = useGetEvents();
  const { achievements } = useGetAchievements();
  const { userAchievements } = useGetUserAchievements();
  const { revokeAchievement } = useRevokeAchievement(qc);
  const { syncAchievements, syncAchievementsPending } = useSyncAchievements(qc);
  const [eventId, setEventId] = useState<number | null>(null);

  useEffect(() => {
    if (!events?.length || eventId !== null) return;
    const current =
      events.find((e) => e.is_current) ?? events[events.length - 1];
    if (current) setEventId(current.id);
  }, [events]); // eslint-disable-line react-hooks/exhaustive-deps

  const [nameFilter, setNameFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState<number | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedAchievementId, setSelectedAchievementId] = useState<
    number | null
  >(null);
  const { grantAchievement, grantAchievementPending } = useGrantAchievement(qc);

  const { users } = useGetUsers(eventId ?? 0);
  const { characters } = useGetCharactersForEvent(eventId ?? 0);

  const currentEvent = useMemo(
    () => events.find((e) => e.id === eventId),
    [events, eventId],
  );

  const teamNameById = useMemo(() => {
    const map: Record<number, string> = {};
    currentEvent?.teams.forEach((t) => (map[t.id] = t.name));
    return map;
  }, [currentEvent]);

  const characterByUserId = useMemo(() => {
    const map: Record<number, { name: string; id: string; level: number }> = {};
    characters.forEach((c) => {
      if (c.user_id === undefined) return;
      const existing = map[c.user_id];
      if (!existing || c.level > existing.level) {
        map[c.user_id] = { name: c.name, id: c.id, level: c.level };
      }
    });
    return map;
  }, [characters]);

  const achievementById = useMemo(() => {
    const map: Record<number, AchievementResponse> = {};
    achievements.forEach((a) => {
      if (a.id !== undefined) map[a.id] = a;
    });
    return map;
  }, [achievements]);

  const achievementsByUserId = useMemo(() => {
    const map: Record<number, AchievementResponse[]> = {};
    userAchievements.forEach((ua) => {
      if (ua.user_id === undefined || ua.achievement_id === undefined) return;
      if (!map[ua.user_id]) map[ua.user_id] = [];
      const achievement = achievementById[ua.achievement_id];
      if (achievement) map[ua.user_id].push(achievement);
    });
    return map;
  }, [userAchievements, achievementById]);

  const filteredUsers = useMemo<UserRow[]>(() => {
    if (!users) return [];
    const q = nameFilter.toLowerCase();
    return users
      .filter(
        (u) =>
          (!teamFilter || u.team_id === teamFilter) &&
          (!q ||
            u.display_name.toLowerCase().includes(q) ||
            u.poe_account_name?.toLowerCase().includes(q) ||
            u.discord_name?.toLowerCase().includes(q)),
      )
      .map((u) => ({
        ...u,
        team_name: teamNameById[u.team_id] ?? String(u.team_id),
        character_name: characterByUserId[u.id]?.name ?? "",
        character_id: characterByUserId[u.id]?.id ?? null,
        existing_achievements: achievementsByUserId[u.id] ?? [],
      }));
  }, [
    users,
    nameFilter,
    teamFilter,
    teamNameById,
    characterByUserId,
    achievementsByUserId,
  ]);

  const selectedUsers = useMemo(
    () => filteredUsers.filter((_, i) => rowSelection[i]),
    [filteredUsers, rowSelection],
  );

  const allFilteredSelected =
    filteredUsers.length > 0 && filteredUsers.every((_, i) => rowSelection[i]);

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setRowSelection({});
    } else {
      const next: RowSelectionState = {};
      filteredUsers.forEach((_, i) => (next[i] = true));
      setRowSelection(next);
    }
  }

  const columns: ColumnDef<UserRow>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={allFilteredSelected}
          onChange={toggleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={!!rowSelection[row.index]}
          onChange={() =>
            setRowSelection((prev) => ({
              ...prev,
              [row.index]: !prev[row.index],
            }))
          }
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      header: "PoE Account",
      accessorKey: "poe_account_name",
      size: 180,
    },
    {
      header: "Discord",
      accessorKey: "discord_name",
      size: 160,
    },
    {
      header: "Team",
      accessorKey: "team_name",
      size: 140,
    },
    {
      header: "Character",
      id: "character_name",
      size: 160,
      cell: ({ row }) =>
        row.original.character_id && eventId ? (
          <Link
            to="/profile/$userId/$eventId/$characterId"
            params={{
              userId: row.original.id,
              eventId: eventId,
              characterId: row.original.character_id,
            }}
            className="flex items-center gap-1 hover:text-primary"
          >
            <ArrowTopRightOnSquareIcon className="inline size-4" />
            {row.original.character_name}
          </Link>
        ) : (
          row.original.character_name
        ),
    },
    {
      header: "Achievements",
      id: "achievements",
      size: 700,
      cell: ({ row }) => (
        <div className="flex w-full flex-wrap gap-1">
          {row.original.existing_achievements.map((a, i) => {
            const url = iconDataUrl(a);
            const shade = BADGE_SHADES[i % BADGE_SHADES.length];
            return (
              <div
                key={a.id}
                className={`badge gap-1 py-3 ${shade}`}
                title={a.description ?? a.name}
              >
                {url && (
                  <img src={url} alt="" className="h-4 w-4 object-contain" />
                )}
                <span className="text-xs">{a.name}</span>
                <button
                  className="ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
                  onClick={() => revokeAchievement(row.original.id, a.id!)}
                >
                  <XMarkIcon className="h-3 w-3 stroke-2" strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      ),
      enableSorting: false,
    },
  ];

  async function handleGrant() {
    if (!selectedAchievementId) return;
    await Promise.all(
      selectedUsers.map((u) => grantAchievement(u.id, selectedAchievementId)),
    );
    setRowSelection({});
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-64">
          <Select<number>
            placeholder="Select event"
            value={eventId}
            onChange={(v) => {
              setEventId(v);
              setRowSelection({});
            }}
            options={(events ?? [])
              .sort(
                (a, b) =>
                  new Date(b.event_start_time).getTime() -
                  new Date(a.event_start_time).getTime(),
              )
              .map((e) => ({ label: e.name, value: e.id }))}
          />
        </div>
        {eventId && (
          <>
            <label className="input">
              <span className="label">Filter</span>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => {
                  setNameFilter(e.target.value);
                  setRowSelection({});
                }}
              />
            </label>
            <div className="w-48">
              <Select<number>
                placeholder="All teams"
                value={teamFilter}
                onChange={(v) => {
                  setTeamFilter(v);
                  setRowSelection({});
                }}
                options={(currentEvent?.teams ?? []).map((t) => ({
                  label: t.name,
                  value: t.id,
                }))}
              />
            </div>
          </>
        )}
        <button
          className="btn ml-auto"
          disabled={syncAchievementsPending}
          onClick={() => syncAchievements()}
        >
          {syncAchievementsPending && (
            <span className="loading loading-xs loading-spinner" />
          )}
          Sync achievements
        </button>
        <div className="w-64">
          <Select<number>
            placeholder="Select achievement"
            value={selectedAchievementId}
            onChange={(v) => setSelectedAchievementId(v)}
            options={achievements.map((a) => ({
              label: a.name ?? String(a.id),
              value: a.id!,
            }))}
          />
        </div>
        <button
          className="btn btn-success"
          disabled={!selectedAchievementId || grantAchievementPending}
          onClick={handleGrant}
        >
          {grantAchievementPending && (
            <span className="loading loading-xs loading-spinner" />
          )}
          Grant to {selectedUsers.length} player
          {selectedUsers.length !== 1 ? "s" : ""}
        </button>
      </div>

      {eventId && (
        <VirtualizedTable
          columns={columns}
          data={filteredUsers}
          className="h-[70vh]"
        />
      )}
    </div>
  );
}

export default GrantAchievementsPage;
