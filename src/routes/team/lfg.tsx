import { useGetEventStatus, useGetTeamSheet, useGetUsers } from "@api";
import Table from "@components/table/table";
import { ColumnDef } from "@components/table/react-table-shim";
import { GlobalStateContext } from "@utils/context-provider";
import { REALMS } from "@mytypes/realms";
import { createFileRoute } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/team/lfg")({
  component: RouteComponent,
});

type LfgRow = {
  displayName: string;
  poeAccountName?: string;
  discordName?: string;
  characterName?: string;
  realm?: string;
};

function RouteComponent() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { users = [] } = useGetUsers(currentEvent.id);
  const { teamSheet = [] } = useGetTeamSheet(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const [selectedRealms, setSelectedRealms] = useState<Set<string>>(
    new Set(),
  );

  if (!eventStatus?.team_id) {
    return <div className="p-4">You need to be on a team to see this.</div>;
  }

  const userById = new Map(users.map((u) => [u.id, u]));
  const rows: LfgRow[] = teamSheet
    .filter((entry) => entry.looking_for_group)
    .filter(
      (entry) =>
        selectedRealms.size === 0 ||
        (entry.realm && selectedRealms.has(entry.realm)),
    )
    .map((entry) => {
      const member = userById.get(entry.user.id);
      return {
        displayName: entry.user.display_name,
        poeAccountName: member?.poe_account_name ?? undefined,
        discordName: entry.user.discord_name ?? undefined,
        characterName: entry.character_name,
        realm: entry.realm,
      };
    });

  const columns: ColumnDef<LfgRow>[] = [
    { header: "Player", accessorKey: "displayName", size: 160 },
    { header: "Discord", accessorKey: "discordName", size: 160 },
    { header: "PoE Account Name", accessorKey: "poeAccountName", size: 160 },
    { header: "Character Name", accessorKey: "characterName", size: 160 },
    { header: "Realm", accessorKey: "realm", size: 100 },
  ];

  const toggleRealm = (realm: string) => {
    setSelectedRealms((prev) => {
      const next = new Set(prev);
      if (next.has(realm)) {
        next.delete(realm);
      } else {
        next.add(realm);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-box bg-base-300 p-4 text-sm">
        This page is a quick way to find other people who have selected the
        "Looking For Group" option, to make finding groups on your realm
        easier.
      </div>
      <div className="flex flex-wrap gap-1">
        {REALMS.map((realm) => (
          <button
            key={realm}
            onClick={() => toggleRealm(realm)}
            className={twMerge(
              "btn rounded-lg px-2 btn-sm",
              selectedRealms.has(realm)
                ? "btn-primary"
                : "border-primary bg-base-100/0 text-primary",
            )}
          >
            {realm}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="text-base-content/60">
          No one is looking for a group right now.
        </div>
      ) : (
        <Table columns={columns} data={rows} className="max-h-[70vh]" />
      )}
    </div>
  );
}
