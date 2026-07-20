import {
  Permission,
  useGetAchievements,
  useGetUserAchievements,
  useRevokeAchievement,
  useGetAllUsers,
} from "@api";
import Table from "@components/table/table";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createFileRoute, Link } from "@tanstack/react-router";
import { renderConditionally } from "@utils/token";
import { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/achievements/$achievementId")({
  component: renderConditionally(AchievementDetailPage, [
    Permission.admin,
    Permission.objective_designer,
  ]),
  params: {
    parse: (params) => ({ achievementId: Number(params.achievementId) }),
    stringify: (params) => ({ achievementId: String(params.achievementId) }),
  },
});


type GrantRow = {
  user_id: number;
  display_name: string;
  poe_account_name?: string;
  discord_name?: string;
  granted_at?: string;
};

function AchievementDetailPage() {
  const { achievementId } = Route.useParams();
  const qc = useQueryClient();
  const { achievements } = useGetAchievements();
  const { userAchievements } = useGetUserAchievements();
  const { revokeAchievement } = useRevokeAchievement(qc);

  const { usersById } = useGetAllUsers();

  const achievement = useMemo(
    () => achievements.find((a) => a.id === achievementId) ?? null,
    [achievements, achievementId],
  );

  const grants = useMemo<GrantRow[]>(() => {
    if (!usersById) {
      return [];
    }
    return userAchievements
      .filter(
        (ua) => ua.achievement_id === achievementId && ua.user_id !== undefined,
      )
      .map((ua) => {
        const u = usersById[ua.user_id!];
        return {
          user_id: ua.user_id!,
          display_name: u?.display_name ?? String(ua.user_id),
          poe_account_name: u?.account_name,
          discord_name: u?.discord_name,
          granted_at: ua.granted_at,
        };
      });
  }, [userAchievements, achievementId, usersById]);

  const columns: ColumnDef<GrantRow>[] = [
    {
      header: "Player",
      accessorKey: "display_name",
      cell: (info) => (
        <Link
          to="/profile/$userId"
          params={{ userId: info.row.original.user_id }}
          className="hover:text-primary"
        >
          {info.row.original.display_name}
        </Link>
      ),
    },
    {
      header: "PoE Account",
      accessorKey: "poe_account_name",
    },
    {
      header: "Discord",
      accessorKey: "discord_name",
    },
    {
      header: "Granted At",
      accessorKey: "granted_at",
      cell: (info) =>
        info.row.original.granted_at
          ? new Date(info.row.original.granted_at).toLocaleString()
          : "—",
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: (info) => (
        <button
          className="btn btn-xs btn-error"
          onClick={() =>
            revokeAchievement(info.row.original.user_id, achievementId)
          }
          title="Revoke achievement"
        >
          <XMarkIcon className="size-4" />
        </button>
      ),
    },
  ];

  const iconUrl = achievement?.icon_url
  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/achievements" className="btn btn-ghost btn-sm">
          ← Back
        </Link>
        {iconUrl && (
          <img src={iconUrl} alt="" className="size-12 object-contain" />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {achievement?.name ?? `Achievement #${achievementId}`}
          </h1>
          {achievement?.description && (
            <p className="text-base-content/70">{achievement.description}</p>
          )}
        </div>
        <span className="ml-auto badge badge-neutral">
          {grants.length} player{grants.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Table columns={columns} data={grants} />
    </div>
  );
}

export default AchievementDetailPage;
