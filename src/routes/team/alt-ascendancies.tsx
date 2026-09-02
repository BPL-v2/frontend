import {
  TeamSheetEntryUpdate,
  useGetEventStatus,
  useGetTeamSheet,
  useGetUser,
  useGetUsers,
  useSaveMyTeamSheetEntry,
} from "@api";
import Table from "@components/table/table";
import { ColumnDef } from "@components/table/react-table-shim";
import Select, { SelectOption } from "@components/form/select";
import { GlobalStateContext } from "@utils/context-provider";
import { ALT_ASCENDANCIES } from "@mytypes/alt-ascendancies";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";

export const Route = createFileRoute("/team/alt-ascendancies")({
  component: RouteComponent,
});

const ALT_ASCENDANCY_OPTIONS: SelectOption<string>[] = ALT_ASCENDANCIES.map(
  (name) => ({
    label: name,
    value: name,
  }),
);

type AltAscendancyRow = {
  displayName: string;
  poeAccountName?: string;
  discordName?: string;
  characterName?: string;
  altAscendancy?: string;
};

function RouteComponent() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { user } = useGetUser();
  const { users = [] } = useGetUsers(currentEvent.id);
  const { teamSheet = [] } = useGetTeamSheet(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const qc = useQueryClient();
  const { saveMyTeamSheetEntry } = useSaveMyTeamSheetEntry(currentEvent.id, qc);

  if (!eventStatus?.team_id) {
    return <div className="p-4">You need to be on a team to see this.</div>;
  }

  const myEntry = teamSheet.find((e) => e.user.id === user?.id);

  // The save endpoint replaces the whole sheet entry, not just the field
  // that changed - every other field has to be carried over from the
  // current entry or it'd get wiped out.
  const setMyAltAscendancy = (value: string | undefined) => {
    const update: TeamSheetEntryUpdate = {
      character_name: myEntry?.character_name ?? "",
      role: myEntry?.role ?? "",
      specialization: myEntry?.specialization ?? "",
      secondary_role: myEntry?.secondary_role ?? "",
      secondary_specialization: myEntry?.secondary_specialization ?? "",
      ascendancy: myEntry?.ascendancy ?? "",
      main_skill: myEntry?.main_skill ?? "",
      build_notes: myEntry?.build_notes ?? "",
      pob_url: myEntry?.pob_url ?? "",
      guide_url: myEntry?.guide_url ?? "",
      realm: myEntry?.realm ?? "",
      uniques_needed: myEntry?.uniques_needed ?? "",
      altars: myEntry?.altars ?? "",
      looking_for_group: myEntry?.looking_for_group ?? false,
      alt_ascendancy: value ?? "",
    };
    saveMyTeamSheetEntry(eventStatus.team_id!, update);
  };

  const userById = new Map(users.map((u) => [u.id, u]));
  const rows: AltAscendancyRow[] = teamSheet
    .filter((entry) => entry.alt_ascendancy)
    .map((entry) => {
      const member = userById.get(entry.user.id);
      return {
        displayName: entry.user.display_name,
        poeAccountName: member?.poe_account_name ?? undefined,
        discordName: entry.user.discord_name ?? undefined,
        characterName: entry.character_name,
        altAscendancy: entry.alt_ascendancy,
      };
    });

  const columns: ColumnDef<AltAscendancyRow>[] = [
    { header: "Player", accessorKey: "displayName", size: 160 },
    { header: "Discord", accessorKey: "discordName", size: 160 },
    { header: "PoE Account Name", accessorKey: "poeAccountName", size: 160 },
    { header: "Character Name", accessorKey: "characterName", size: 160 },
    { header: "Alt Ascendancy", accessorKey: "altAscendancy", size: 160 },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-box bg-base-300 p-4 text-sm">
        Add yourself to the list below if one of your characters needs an
        Alternate Ascendancy applied.
      </div>
      <label className="fieldset w-xs">
        <span className="label">Your Alt Ascendancy</span>
        <Select<string>
          options={ALT_ASCENDANCY_OPTIONS}
          value={myEntry?.alt_ascendancy || null}
          placeholder="None needed"
          onChange={setMyAltAscendancy}
        />
      </label>
      {rows.length === 0 ? (
        <div className="text-base-content/60">
          No one needs an Alternate Ascendancy right now.
        </div>
      ) : (
        <Table columns={columns} data={rows} className="max-h-[70vh]" />
      )}
    </div>
  );
}
