import { ItemField, TeamSheetEntryUpdate } from "@api";
import {
  useCreateItemWish,
  useDeleteItemWish,
  useGetEventStatus,
  useGetTeamSheet,
  useGetUser,
  useGetUsers,
  useGetWishlist,
  useSaveMyTeamSheetEntry,
  useUpdateItemWish,
} from "@api";
import Table from "@components/table/table";
import Select from "@components/form/select";
import { UniquesPickerModal } from "@components/form-dialogs/UniquesPickerModal";
import { MultiSelectPickerModal } from "@components/form-dialogs/MultiSelectPickerModal";
import { PieChart } from "@components/charts/pie-chart";
import { tallyByPlayer } from "@utils/chart-tally";
import { ColumnDef } from "@components/table/react-table-shim";
import { GlobalStateContext } from "@utils/context-provider";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { defaultPreferences } from "@mytypes/preferences";
import { SKILL_GEMS } from "@mytypes/skill-gems";
import { REALMS } from "@mytypes/realms";

export const Route = createFileRoute("/team/sheet")({
  component: RouteComponent,
});

const ROLES = [
  "Janitor",
  "Crafter",
  "Delver",
  "Lab",
  "Heister",
  "Bosser",
  "Support",
  "Atziri Jail",
  "Breach",
  "Bestiary",
  "Incursion",
  "Delirium",
  "Blight",
  "Expedition",
  "Ritual",
  "Ultimatum",
  "Sanctum",
];

const ASCENDANCIES = [
  "Undecided",
  "Ascendant",
  "Assassin",
  "Berserker",
  "Champion",
  "Chieftain",
  "Deadeye",
  "Elementalist",
  "Gladiator",
  "Guardian",
  "Hierophant",
  "Inquisitor",
  "Juggernaut",
  "Necromancer",
  "Occultist",
  "Pathfinder",
  "Saboteur",
  "Slayer",
  "Trickster",
  "Warden",
  "Reliquarian",
  "Luminary",
];

const ALTARS = ["Eater", "Exarch"];

type SheetRow = {
  userId: number;
  displayName: string;
  poeAccountName?: string;
  discordName?: string;
  isMe: boolean;
  characterName?: string;
  role?: string;
  secondaryRole?: string;
  ascendancy?: string;
  mainSkill?: string;
  buildNotes?: string;
  pobUrl?: string;
  realm?: string;
  uniquesNeeded?: string;
  altars?: string;
  lookingForGroup: boolean;
};

const emptyForm: TeamSheetEntryUpdate = {
  character_name: "",
  role: "",
  secondary_role: "",
  ascendancy: "",
  main_skill: "",
  build_notes: "",
  pob_url: "",
  realm: "",
  uniques_needed: "",
  altars: "",
  looking_for_group: false,
};

// Renders a <select>, always including the current value as an option even
// if it's not in `options` (covers old free-text data / unlisted values).
function OptionSelect({
  value,
  options,
  placeholder,
  onChange,
  preserveUnknownValue = true,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  preserveUnknownValue?: boolean;
}) {
  const allOptions =
    preserveUnknownValue && value && !options.includes(value)
      ? [value, ...options]
      : options;
  return (
    <select
      className="select w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {allOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function RouteComponent() {
  const { currentEvent, preferences, setPreferences } =
    useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { user } = useGetUser();
  const { users = [] } = useGetUsers(currentEvent.id);
  const { teamSheet = [] } = useGetTeamSheet(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const qc = useQueryClient();
  const { saveMyTeamSheetEntry } = useSaveMyTeamSheetEntry(
    currentEvent.id,
    qc,
  );
  const { wishlist = [] } = useGetWishlist(currentEvent.id, eventStatus?.team_id);
  const { saveItemWish } = useCreateItemWish(qc, currentEvent.id, eventStatus?.team_id);
  const { updateItemWish } = useUpdateItemWish(qc, currentEvent.id, eventStatus?.team_id);
  const { deleteItemWish } = useDeleteItemWish(qc, currentEvent.id, eventStatus?.team_id);
  const [uniquesPickerOpen, setUniquesPickerOpen] = useState(false);
  const [secondaryRolePickerOpen, setSecondaryRolePickerOpen] =
    useState(false);
  const [specFilter, setSpecFilter] = useState<string | null>(null);
  const [characterNameError, setCharacterNameError] = useState<string | null>(
    null,
  );

  const [form, setForm] = useState<TeamSheetEntryUpdate>(emptyForm);

  const myEntry = teamSheet.find((e) => e.user.id === user?.id);
  const myTeam = currentEvent.teams?.find(
    (t) => t.id === eventStatus?.team_id,
  );

  useEffect(() => {
    setForm({
      character_name: myEntry?.character_name ?? "",
      role: myEntry?.role ?? "",
      secondary_role: myEntry?.secondary_role ?? "",
      ascendancy: myEntry?.ascendancy ?? "",
      main_skill: myEntry?.main_skill ?? "",
      build_notes: myEntry?.build_notes ?? "",
      pob_url: myEntry?.pob_url ?? "",
      realm: myEntry?.realm ?? "",
      uniques_needed: myEntry?.uniques_needed ?? "",
      altars: myEntry?.altars ?? "",
      looking_for_group: myEntry?.looking_for_group ?? false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myEntry?.character_name, myEntry?.role]);

  const isTransfiguredGem = (skill: string) => {
    if (!skill.includes(" of ")) return false;
    const base = skill.split(" of ")[0];
    return base !== skill && SKILL_GEMS.includes(base);
  };

  const handleMainSkillChange = (skill: string) => {
    setForm((f) => ({ ...f, main_skill: skill }));
  };

  const syncTransfiguredGemWish = (skill: string) => {
    if (
      skill &&
      isTransfiguredGem(skill) &&
      !wishlist.some(
        (w) => w.item_field === ItemField.BASE_TYPE && w.value === skill,
      )
    ) {
      saveItemWish({ item_field: ItemField.BASE_TYPE, value: skill });
    }
  };

  const handleUniquesConfirm = (needed: string[], buildEnabling: Set<string>) => {
    setForm((f) => ({ ...f, uniques_needed: needed.join(", ") }));
    const myUniqueWishes = wishlist.filter(
      (w) => w.user_id === user?.id && w.item_field === ItemField.NAME,
    );
    const existingByValue = new Map(myUniqueWishes.map((w) => [w.value, w]));
    for (const name of needed) {
      const existing = existingByValue.get(name);
      const wantBuildEnabling = buildEnabling.has(name);
      if (!existing) {
        saveItemWish({
          item_field: ItemField.NAME,
          value: name,
          build_enabling: wantBuildEnabling,
        });
      } else if (existing.build_enabling !== wantBuildEnabling) {
        updateItemWish(existing.id, { build_enabling: wantBuildEnabling });
      }
    }
    for (const wish of myUniqueWishes) {
      if (!needed.includes(wish.value)) {
        deleteItemWish(wish.id);
      }
    }
  };

  if (!eventStatus?.team_id) {
    return <div className="p-4">You need to be on a team to see this.</div>;
  }

  const teammates = users.filter((u) => u.team_id === eventStatus.team_id);
  const entryByUserId = new Map(teamSheet.map((e) => [e.user.id, e]));

  const rows: SheetRow[] = teammates.map((member) => {
    const entry = entryByUserId.get(member.id);
    return {
      userId: member.id,
      displayName: member.display_name,
      poeAccountName: member.poe_account_name ?? undefined,
      discordName: member.discord_name ?? undefined,
      isMe: member.id === user?.id,
      characterName: entry?.character_name,
      role: entry?.role,
      secondaryRole: entry?.secondary_role,
      ascendancy: entry?.ascendancy,
      mainSkill: entry?.main_skill,
      buildNotes: entry?.build_notes,
      pobUrl: entry?.pob_url,
      realm: entry?.realm,
      uniquesNeeded: entry?.uniques_needed,
      altars: entry?.altars,
      lookingForGroup: entry?.looking_for_group ?? false,
    };
  });
  rows.sort((a, b) =>
    a.isMe ? -1 : b.isMe ? 1 : a.displayName.localeCompare(b.displayName),
  );
  const visibleRows = specFilter
    ? rows.filter((row) => row.role === specFilter)
    : rows;

  const mainRoleData = tallyByPlayer(
    rows.map((row) => ({
      value: row.role,
      player: row.displayName,
    })),
  );

  const columns: ColumnDef<SheetRow>[] = [
    {
      header: "Player",
      accessorKey: "displayName",
      size: 160,
      cell: (info) => (
        <div>
          <div className="font-semibold">{info.row.original.displayName}</div>
          {info.row.original.poeAccountName && (
            <div className="text-xs text-base-content/60">
              {info.row.original.poeAccountName}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "Discord",
      header: "Discord",
      accessorKey: "discordName",
      size: 130,
      cell: (info) => info.row.original.discordName ?? "-",
    },
    {
      id: "Character",
      header: "Character",
      accessorKey: "characterName",
      size: 140,
    },
    { id: "Realm", header: "Realm", accessorKey: "realm", size: 90 },
    {
      id: "LFG",
      header: "LFG",
      accessorKey: "lookingForGroup",
      size: 60,
      cell: (info) =>
        info.row.original.lookingForGroup ? (
          <CheckIcon className="size-5 text-success" />
        ) : (
          <XMarkIcon className="size-5 text-base-content/30" />
        ),
    },
    { id: "Role", header: "Role", accessorKey: "role", size: 100 },
    {
      id: "2nd Role",
      header: "2nd Role",
      accessorKey: "secondaryRole",
      size: 100,
    },
    {
      id: "Altars",
      header: "Altars",
      accessorKey: "altars",
      size: 90,
    },
    {
      id: "Ascendancy",
      header: "Ascendancy",
      accessorKey: "ascendancy",
      size: 110,
    },
    {
      id: "Main Skill",
      header: "Main Skill",
      accessorKey: "mainSkill",
      size: 130,
    },
    {
      id: "Build Notes",
      header: "Build Notes",
      accessorKey: "buildNotes",
      size: 200,
    },
    {
      id: "Uniques Needed",
      header: "Uniques Needed",
      accessorKey: "uniquesNeeded",
      size: 200,
    },
    {
      id: "PoB",
      header: "PoB",
      accessorKey: "pobUrl",
      size: 70,
      cell: (info) =>
        info.row.original.pobUrl ? (
          <a
            href={info.row.original.pobUrl}
            target="_blank"
            rel="noreferrer"
            className="link link-primary"
          >
            link
          </a>
        ) : null,
    },
  ];

  const visibleColumns = columns.filter(
    (col) =>
      !col.id ||
      preferences.teamSheet[col.id as keyof typeof preferences.teamSheet],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <form
        className="flex flex-col gap-3 rounded-box bg-base-300 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const requiredPrefix = myTeam?.abbreviation
            ? `${myTeam.abbreviation}_`
            : null;
          if (
            requiredPrefix &&
            !(form.character_name ?? "").startsWith(requiredPrefix)
          ) {
            setCharacterNameError(
              `Character name must begin with ${requiredPrefix}`,
            );
            return;
          }
          setCharacterNameError(null);
          saveMyTeamSheetEntry(eventStatus.team_id!, form);
          if (form.main_skill) {
            syncTransfiguredGemWish(form.main_skill);
          }
        }}
      >
        <div className="text-lg font-semibold">Your row</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <label className="fieldset">
            <span className="label">Character Name</span>
            <input
              type="text"
              className={twMerge(
                "input w-full",
                characterNameError ? "input-error" : "",
              )}
              value={form.character_name ?? ""}
              onChange={(e) => {
                setForm((f) => ({ ...f, character_name: e.target.value }));
                setCharacterNameError(null);
              }}
            />
            {characterNameError ? (
              <span className="label text-xs text-error">
                {characterNameError}
              </span>
            ) : (
              myTeam?.abbreviation && (
                <span className="label text-xs text-warning">
                  Must begin with {myTeam.abbreviation}_
                </span>
              )
            )}
          </label>
          <label className="fieldset">
            <span className="label">Realm</span>
            <OptionSelect
              value={form.realm ?? ""}
              options={REALMS}
              placeholder="Pick a realm"
              onChange={(v) => setForm((f) => ({ ...f, realm: v }))}
            />
          </label>
          <label className="fieldset">
            <span className="label">Role</span>
            <OptionSelect
              value={form.role ?? ""}
              options={ROLES}
              placeholder="Pick a role"
              onChange={(v) => setForm((f) => ({ ...f, role: v }))}
              preserveUnknownValue={false}
            />
          </label>
          <label className="fieldset">
            <span className="label">Ascendancy</span>
            <OptionSelect
              value={form.ascendancy ?? ""}
              options={ASCENDANCIES}
              placeholder="Pick an ascendancy"
              onChange={(v) => setForm((f) => ({ ...f, ascendancy: v }))}
            />
          </label>
          <label className="fieldset">
            <span className="label">Main Skill</span>
            <Select
              options={
                form.main_skill && !SKILL_GEMS.includes(form.main_skill)
                  ? [form.main_skill, ...SKILL_GEMS]
                  : SKILL_GEMS
              }
              value={form.main_skill || null}
              placeholder="Pick a skill"
              onChange={(v) => handleMainSkillChange(v ?? "")}
            />
          </label>
          <label className="fieldset">
            <span className="label">Secondary Role</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setSecondaryRolePickerOpen(true)}
              >
                Pick roles...
              </button>
              <span className="text-sm text-base-content/60">
                {form.secondary_role || "none picked yet"}
              </span>
            </div>
          </label>
          <label className="fieldset">
            <span className="label">Altars</span>
            <OptionSelect
              value={form.altars ?? ""}
              options={ALTARS}
              placeholder="Pick an altar"
              onChange={(v) => setForm((f) => ({ ...f, altars: v }))}
            />
          </label>
          <label className="fieldset lg:col-start-5">
            <span className="label">PoB/Guide Link</span>
            <input
              type="text"
              className="input w-full"
              value={form.pob_url ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, pob_url: e.target.value }))
              }
            />
          </label>
        </div>
        <label className="fieldset">
          <span className="label">Build Notes</span>
          <textarea
            className="textarea w-full"
            value={form.build_notes ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, build_notes: e.target.value }))
            }
          />
        </label>
        <label className="fieldset">
          <span className="label">Uniques Needed</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setUniquesPickerOpen(true)}
            >
              Pick uniques...
            </button>
            <span className="text-sm text-base-content/60">
              {form.uniques_needed || "none picked yet"}
            </span>
          </div>
        </label>
        <label className="flex w-fit cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="checkbox"
            checked={form.looking_for_group ?? false}
            onChange={(e) =>
              setForm((f) => ({ ...f, looking_for_group: e.target.checked }))
            }
          />
          Looking for group
        </label>
        <button type="submit" className="btn w-fit btn-primary">
          Save
        </button>
      </form>
      <div className="rounded-box bg-base-300 p-6">
        <div className="mb-4 text-lg font-semibold">Main Role</div>
        <PieChart
          data={mainRoleData}
          selected={specFilter}
          onSelect={setSpecFilter}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {Object.keys(defaultPreferences.teamSheet).map((label) => {
          const key = label as keyof typeof preferences.teamSheet;
          return (
            <button
              key={label}
              onClick={() =>
                setPreferences({
                  ...preferences,
                  teamSheet: {
                    ...preferences.teamSheet,
                    [label]: !preferences.teamSheet[key],
                  },
                })
              }
              className={twMerge(
                "btn rounded-lg px-2 btn-sm",
                preferences.teamSheet[key]
                  ? "btn-primary"
                  : "border-primary bg-base-100/0 text-primary",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      {specFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span>
            Filtered by role:{" "}
            <span className="font-semibold">{specFilter}</span>
          </span>
          <button
            className="btn btn-xs"
            onClick={() => setSpecFilter(null)}
          >
            Clear
          </button>
        </div>
      )}
      <Table
        columns={visibleColumns}
        data={visibleRows}
        className="max-h-[60vh]"
      />
      <UniquesPickerModal
        isOpen={uniquesPickerOpen}
        setIsOpen={setUniquesPickerOpen}
        initialNeeded={
          form.uniques_needed
            ? form.uniques_needed
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : []
        }
        initialBuildEnabling={
          new Set(
            wishlist
              .filter(
                (w) =>
                  w.user_id === user?.id &&
                  w.item_field === ItemField.NAME &&
                  w.build_enabling,
              )
              .map((w) => w.value),
          )
        }
        onConfirm={handleUniquesConfirm}
      />
      <MultiSelectPickerModal
        title="Pick secondary roles"
        isOpen={secondaryRolePickerOpen}
        setIsOpen={setSecondaryRolePickerOpen}
        options={ROLES}
        initialSelected={
          form.secondary_role
            ? form.secondary_role
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : []
        }
        onConfirm={(selected) =>
          setForm((f) => ({ ...f, secondary_role: selected.join(", ") }))
        }
      />
    </div>
  );
}
