import { GameVersion, ItemField, TeamSheetEntryUpdate } from "@api";
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
import Select, { SelectOption } from "@components/form/select";
import {
  NeededUnique,
  UniquesPickerModal,
} from "@components/form-dialogs/UniquesPickerModal";
import { GemsPickerModal } from "@components/form-dialogs/GemsPickerModal";
import { SecondaryRolePickerModal } from "@components/form-dialogs/SecondaryRolePickerModal";
import { TextNoteModal } from "@components/form-dialogs/TextNoteModal";
import { PieChart } from "@components/charts/pie-chart";
import { tallyByPlayer } from "@utils/chart-tally";
import { ColumnDef } from "@components/table/react-table-shim";
import { GlobalStateContext } from "@utils/context-provider";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { classColorToHex, pickColor } from "@utils/color";
import { defaultPreferences } from "@mytypes/preferences";
import { SKILL_GEMS, isTransfiguredGem } from "@mytypes/skill-gems";
import { SKILL_GEM_COLORS } from "@mytypes/main-skill";
import { REALMS, REALM_COLORS } from "@mytypes/realms";
import {
  ascendancies,
  UNDECIDED_ASCENDANCY_COLOR,
} from "@mytypes/ascendancy_DeKa";
import { ALTARS, ALTAR_COLORS } from "@mytypes/altars";
import {
  ROLES,
  SPECIALIZATIONS,
  ROLE_COLORS,
  SPECIALIZATION_COLORS,
} from "@mytypes/roles";
import { decodePoBExport, Rarity } from "@utils/pob";

export const Route = createFileRoute("/team/sheet")({
  component: RouteComponent,
});

const BASE_CLASSES = new Set([
  "Scion",
  "Marauder",
  "Duelist",
  "Ranger",
  "Witch",
  "Templar",
  "Shadow",
]);
const ASCENDANCIES = [
  "Undecided",
  ...Object.keys(ascendancies[GameVersion.poe1]).filter(
    (name) => !BASE_CLASSES.has(name),
  ),
];

function renderLinkCell(url?: string) {
  if (!url) return null;
  return (
    <a
      href={/^https?:\/\//i.test(url) ? url : undefined}
      target="_blank"
      rel="noreferrer"
      className="link link-primary"
    >
      link
    </a>
  );
}

type SheetRow = {
  userId: number;
  displayName: string;
  poeAccountName?: string;
  discordName?: string;
  isMe: boolean;
  characterName?: string;
  role?: string;
  specialization?: string;
  secondaryRole?: string;
  secondarySpecialization?: string;
  ascendancy?: string;
  mainSkill?: string;
  buildNotes?: string;
  pobUrl?: string;
  guideUrl?: string;
  realm?: string;
  uniquesNeeded?: string;
  gemsNeeded?: string;
  altars?: string;
  lookingForGroup: boolean;
};

function RouteComponent() {
  const { currentEvent, preferences, setPreferences } =
    useContext(GlobalStateContext);
  const ASCENDANCY_OPTIONS: SelectOption<string>[] = ASCENDANCIES.map(
    (name) => ({
      label: name,
      value: name,
      color: pickColor(
        preferences.colorfulAscendancy,
        name === "Undecided"
          ? UNDECIDED_ASCENDANCY_COLOR
          : ascendancies[GameVersion.poe1][name]?.classColor,
      ),
    }),
  );
  const SKILL_GEM_OPTIONS: SelectOption<string>[] = SKILL_GEMS.map((name) => ({
    label: name,
    value: name,
    color: pickColor(preferences.colorfulMainSkill, SKILL_GEM_COLORS[name]),
  }));
  const ALTAR_OPTIONS: SelectOption<string>[] = ALTARS.map((name) => ({
    label: name,
    value: name,
    color: pickColor(preferences.colorfulAltars, ALTAR_COLORS[name]),
  }));
  const REALM_OPTIONS: SelectOption<string>[] = REALMS.map((name) => ({
    label: name,
    value: name,
    color: pickColor(preferences.colorfulRealms, REALM_COLORS[name]),
  }));
  const ROLE_OPTIONS: SelectOption<string>[] = ROLES.map((name) => ({
    label: name,
    value: name,
    color: pickColor(preferences.colorfulRoles, ROLE_COLORS[name]),
  }));
  const specializationOptions = (
    role: string | undefined,
  ): SelectOption<string>[] => {
    if (!role) return [];
    return (SPECIALIZATIONS[role] ?? []).map((name) => ({
      label: name,
      value: name,
      color: pickColor(
        preferences.colorfulSpecializations,
        SPECIALIZATION_COLORS[role]?.[name],
      ),
    }));
  };
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { user } = useGetUser();
  const { users = [] } = useGetUsers(currentEvent.id);
  const { teamSheet = [] } = useGetTeamSheet(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const qc = useQueryClient();
  const { saveMyTeamSheetEntry } = useSaveMyTeamSheetEntry(currentEvent.id, qc);
  const { wishlist = [] } = useGetWishlist(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const myUniqueWishes = wishlist.filter(
    (w) => w.user_id === user?.id && w.item_field === ItemField.NAME,
  );
  const myGemWishCount = wishlist.filter(
    (w) => w.user_id === user?.id && w.item_field === ItemField.BASE_TYPE,
  ).length;
  const { saveItemWish } = useCreateItemWish(
    qc,
    currentEvent.id,
    eventStatus?.team_id,
  );
  const { updateItemWish } = useUpdateItemWish(
    qc,
    currentEvent.id,
    eventStatus?.team_id,
  );
  const { deleteItemWish } = useDeleteItemWish(
    qc,
    currentEvent.id,
    eventStatus?.team_id,
  );
  const [uniquesPickerOpen, setUniquesPickerOpen] = useState(false);
  const [gemsPickerOpen, setGemsPickerOpen] = useState(false);
  const [secondaryRolePickerOpen, setSecondaryRolePickerOpen] = useState(false);
  const [extraNotesOpen, setExtraNotesOpen] = useState(false);
  const [specFilter, setSpecFilter] = useState<string | null>(null);
  const [hideEmptyPlayers, setHideEmptyPlayers] = useState(false);
  const [mainRoleChartExpanded, setMainRoleChartExpanded] = useState(
    () => localStorage.getItem("mainRoleChartExpanded") === "true",
  );
  const [detectingUniques, setDetectingUniques] = useState(false);
  const [detectUniquesStatus, setDetectUniquesStatus] = useState("");

  const [form, setForm] = useState<TeamSheetEntryUpdate>({});

  const myEntry = teamSheet.find((e) => e.user.id === user?.id);
  const myTeam = currentEvent.teams?.find((t) => t.id === eventStatus?.team_id);
  const requiredNamePrefix = myTeam?.abbreviation
    ? `${myTeam.abbreviation}_`
    : null;

  useEffect(() => {
    setForm({
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myEntry?.character_name, myEntry?.role]);

  // Keep the "must begin with TEAM_" check live on every keystroke (not
  // just on submit), so the red border and Save-button lock appear
  // immediately instead of only after a failed submit.
  const characterNameError =
    requiredNamePrefix &&
    !(form.character_name ?? "").startsWith(requiredNamePrefix)
      ? `Character name must begin with ${requiredNamePrefix}`
      : null;

  useEffect(() => {
    localStorage.setItem(
      "mainRoleChartExpanded",
      String(mainRoleChartExpanded),
    );
  }, [mainRoleChartExpanded]);

  const formatUniqueWishText = (w: {
    value: string;
    extra?: string;
    quantity: number;
  }) => {
    const base = w.quantity > 1 ? `${w.value} x${w.quantity}` : w.value;
    return w.extra ? `${base} (${w.extra})` : base;
  };

  const syncTransfiguredGemWish = (newSkill: string, oldSkill?: string) => {
    // The main skill's transfigured-gem wish must always track whatever is
    // currently selected - if it changed away from a transfigured gem (to a
    // different one, or to a plain/no gem), the stale wish for the old one
    // must go, not linger on the wishlist forever.
    if (oldSkill && oldSkill !== newSkill && isTransfiguredGem(oldSkill)) {
      const staleWish = wishlist.find(
        (w) =>
          w.user_id === user?.id &&
          w.item_field === ItemField.BASE_TYPE &&
          w.value === oldSkill,
      );
      if (staleWish) {
        deleteItemWish(staleWish.id);
      }
    }
    if (
      newSkill &&
      isTransfiguredGem(newSkill) &&
      !wishlist.some(
        (w) => w.item_field === ItemField.BASE_TYPE && w.value === newSkill,
      )
    ) {
      saveItemWish({ item_field: ItemField.BASE_TYPE, value: newSkill });
    }
  };

  const handleUniquesConfirm = (needed: NeededUnique[]) => {
    setForm((f) => ({
      ...f,
      uniques_needed: needed.map(formatUniqueWishText).join(", "),
    }));
    const wishKey = (value: string, extra: string) =>
      JSON.stringify([value, extra]);
    const existingByKey = new Map(
      myUniqueWishes.map((w) => [wishKey(w.value, w.extra ?? ""), w]),
    );
    const neededKeys = new Set(needed.map((n) => wishKey(n.value, n.extra)));
    for (const n of needed) {
      const existing = existingByKey.get(wishKey(n.value, n.extra));
      if (!existing) {
        saveItemWish({
          item_field: ItemField.NAME,
          value: n.value,
          extra: n.extra,
          build_enabling: n.buildEnabling,
          quantity: n.quantity,
        });
      } else if (
        existing.build_enabling !== n.buildEnabling ||
        existing.quantity !== n.quantity
      ) {
        updateItemWish(existing.id, {
          build_enabling: n.buildEnabling,
          quantity: n.quantity,
        });
      }
    }
    for (const wish of myUniqueWishes) {
      if (!neededKeys.has(wishKey(wish.value, wish.extra ?? ""))) {
        deleteItemWish(wish.id);
      }
    }
  };

  const handleGemsConfirm = (selected: string[]) => {
    // Only manage wishes that are actually transfigured gems here - a plain
    // gem wish added via "Add Item Wish" isn't shown in this picker and
    // must survive a confirm untouched.
    const myGemWishes = wishlist.filter(
      (w) =>
        w.user_id === user?.id &&
        w.item_field === ItemField.BASE_TYPE &&
        isTransfiguredGem(w.value),
    );
    const existingByValue = new Map(myGemWishes.map((w) => [w.value, w]));
    const selectedSet = new Set(selected);
    for (const value of selected) {
      if (!existingByValue.has(value)) {
        saveItemWish({ item_field: ItemField.BASE_TYPE, value });
      }
    }
    for (const wish of myGemWishes) {
      if (!selectedSet.has(wish.value)) {
        deleteItemWish(wish.id);
      }
    }
  };

  const handleDetectUniques = async () => {
    if (!form.pob_url) return;
    setDetectingUniques(true);
    setDetectUniquesStatus("");
    try {
      const pobData = await decodePoBExport(form.pob_url);
      const detectedNames = Array.from(
        new Set(
          pobData.items
            .filter((item) => item.rarity === Rarity.Unique)
            .map((item) => item.name),
        ),
      );
      if (detectedNames.length === 0) {
        setDetectUniquesStatus("No uniques found in that PoB code.");
        return;
      }
      const existing = wishlist.filter(
        (w) => w.user_id === user?.id && w.item_field === ItemField.NAME,
      );
      const merged = new Map<string, NeededUnique>();
      for (const w of existing) {
        merged.set(JSON.stringify([w.value, w.extra ?? ""]), {
          value: w.value,
          extra: w.extra ?? "",
          buildEnabling: w.build_enabling,
          quantity: w.quantity || 1,
        });
      }
      let added = 0;
      for (const name of detectedNames) {
        const key = JSON.stringify([name, ""]);
        if (!merged.has(key)) {
          merged.set(key, {
            value: name,
            extra: "",
            buildEnabling: false,
            quantity: 1,
          });
          added++;
        }
      }
      handleUniquesConfirm(Array.from(merged.values()));
      setDetectUniquesStatus(
        added > 0
          ? `Added ${added} unique${added === 1 ? "" : "s"} to Uniques Needed.`
          : "All detected uniques were already on the list.",
      );
    } catch {
      setDetectUniquesStatus(
        "Couldn't read that as a PoB export code — paste the raw code, not a link.",
      );
    } finally {
      setDetectingUniques(false);
    }
  };

  if (!eventStatus?.team_id) {
    return <div className="p-4">You need to be on a team to see this.</div>;
  }

  const teammates = users.filter((u) => u.team_id === eventStatus.team_id);
  const entryByUserId = new Map(teamSheet.map((e) => [e.user.id, e]));

  // Derived live from the wishlist rather than the persisted
  // team_sheet_entries.uniques_needed text snapshot, so deleting/adding a
  // wish (e.g. from the Wishlist page's trash icon) shows up immediately
  // instead of only after the sheet form is re-saved.
  const appendWishText = (
    map: Map<number, string>,
    userId: number,
    text: string,
  ) => {
    const existing = map.get(userId);
    map.set(userId, existing ? `${existing}, ${text}` : text);
  };

  const uniqueWishTextByUserId = new Map<number, string>();
  const gemWishTextByUserId = new Map<number, string>();
  for (const w of wishlist) {
    if (w.item_field === ItemField.NAME) {
      appendWishText(
        uniqueWishTextByUserId,
        w.user_id,
        formatUniqueWishText(w),
      );
    } else if (
      w.item_field === ItemField.BASE_TYPE &&
      isTransfiguredGem(w.value)
    ) {
      appendWishText(gemWishTextByUserId, w.user_id, w.value);
    }
  }

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
      specialization: entry?.specialization,
      secondaryRole: entry?.secondary_role,
      secondarySpecialization: entry?.secondary_specialization,
      ascendancy: entry?.ascendancy,
      mainSkill: entry?.main_skill,
      buildNotes: entry?.build_notes,
      pobUrl: entry?.pob_url,
      guideUrl: entry?.guide_url,
      realm: entry?.realm,
      uniquesNeeded: uniqueWishTextByUserId.get(member.id),
      gemsNeeded: gemWishTextByUserId.get(member.id),
      altars: entry?.altars,
      lookingForGroup: entry?.looking_for_group ?? false,
    };
  });
  rows.sort((a, b) =>
    a.isMe ? -1 : b.isMe ? 1 : a.displayName.localeCompare(b.displayName),
  );
  // Mapper is broken out into its specializations in the chart below
  // instead of one lumped "Mapper" slice, since that's the one role where
  // players actually differentiate a lot (Atlas mechanics); every other
  // role stays a single slice.
  const mainRoleChartLabel = (row: {
    role?: string;
    specialization?: string;
  }) => (row.role === "Mapper" ? (row.specialization ?? "Mapper") : row.role);

  // Anything the player actually fills in on their own row - excludes
  // Player/Discord (account identity, not something they enter here).
  const hasAnyData = (row: SheetRow) =>
    !!row.characterName ||
    !!row.realm ||
    !!row.role ||
    !!row.specialization ||
    !!row.secondaryRole ||
    !!row.secondarySpecialization ||
    !!row.ascendancy ||
    !!row.mainSkill ||
    !!row.buildNotes ||
    !!row.pobUrl ||
    !!row.guideUrl ||
    !!row.uniquesNeeded ||
    !!row.gemsNeeded ||
    !!row.altars;

  const visibleRows = rows
    .filter((row) =>
      specFilter ? mainRoleChartLabel(row) === specFilter : true,
    )
    .filter((row) => (hideEmptyPlayers ? hasAnyData(row) : true));

  const mainRoleData = tallyByPlayer(
    rows.map((row) => ({
      value: mainRoleChartLabel(row),
      player: row.displayName,
    })),
  ).map((slice) => ({
    ...slice,
    color: classColorToHex(
      SPECIALIZATION_COLORS.Mapper?.[slice.label] ?? ROLE_COLORS[slice.label],
    ),
  }));

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
      id: "Specialization",
      header: "Specialization",
      accessorKey: "specialization",
      size: 130,
    },
    {
      id: "2nd Role",
      header: "2nd Role",
      accessorKey: "secondaryRole",
      size: 100,
    },
    {
      id: "2nd Specialization",
      header: "2nd Specialization",
      accessorKey: "secondarySpecialization",
      size: 160,
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
      id: "Extra Notes",
      header: "Extra Notes",
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
      id: "Transfigured Gems",
      header: "Transfigured Gems",
      accessorKey: "gemsNeeded",
      size: 200,
    },
    {
      id: "PoB",
      header: "PoB",
      accessorKey: "pobUrl",
      size: 70,
      cell: (info) => renderLinkCell(info.row.original.pobUrl),
    },
    {
      id: "Guide",
      header: "Guide",
      accessorKey: "guideUrl",
      size: 70,
      cell: (info) => renderLinkCell(info.row.original.guideUrl),
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
          if (characterNameError) {
            return;
          }
          saveMyTeamSheetEntry(eventStatus.team_id!, form);
          syncTransfiguredGemWish(form.main_skill ?? "", myEntry?.main_skill);
        }}
      >
        <div className="flex items-center justify-center gap-1 text-lg font-semibold">
          Configure your listing and build information
          <span
            className="tooltip"
            data-tip="If you want more colors make sure to look into Settings"
          >
            <QuestionMarkCircleIcon className="size-4 text-base-content/60" />
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {/* Column template must stay identical to the grid below (Ascendancy
          row) so Main Skill/Guide Link/PoB line up under Realm/Role/Specialization.
          48px is a fixed pixel width, not auto, because auto would size against
          each grid's own content independently - here that's the LFG checkbox,
          there it's nothing (Ascendancy spans across it), so auto would drift. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[1fr_48px_1fr_1fr_1fr]">
            <label className="relative fieldset">
              <span className="label">Character Name</span>
              <input
                type="text"
                className={twMerge(
                  "input w-full",
                  characterNameError ? "input-error" : "",
                )}
                value={form.character_name ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, character_name: e.target.value }))
                }
              />
              {characterNameError ? (
                <span className="absolute top-full left-0 label text-xs text-error">
                  {characterNameError}
                </span>
              ) : (
                myTeam?.abbreviation && (
                  <span className="absolute top-full left-0 label text-xs text-warning">
                    Must begin with {myTeam.abbreviation}_
                  </span>
                )
              )}
            </label>
            <div className="fieldset w-fit justify-self-start">
              <span className="label flex items-center gap-1">
                LFG
                <span className="tooltip" data-tip="Looking For Group">
                  <QuestionMarkCircleIcon className="size-4 text-base-content/60" />
                </span>
              </span>
              <input
                type="checkbox"
                className="checkbox size-10"
                checked={form.looking_for_group ?? false}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    looking_for_group: e.target.checked,
                  }))
                }
              />
            </div>
            <label className="fieldset">
              <span className="label">Realm</span>
              <Select<string>
                options={
                  form.realm && !REALMS.includes(form.realm)
                    ? [
                        { label: form.realm, value: form.realm },
                        ...REALM_OPTIONS,
                      ]
                    : REALM_OPTIONS
                }
                value={form.realm || null}
                placeholder="Pick a realm"
                onChange={(v) => setForm((f) => ({ ...f, realm: v ?? "" }))}
              />
            </label>
            <label className="fieldset">
              <span className="label">Role</span>
              <Select<string>
                options={ROLE_OPTIONS}
                value={form.role || null}
                placeholder="Pick a role"
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    role: v ?? "",
                    specialization: "",
                  }))
                }
              />
            </label>
            <label className="fieldset">
              <span className="label">Specialization</span>
              <Select<string>
                options={specializationOptions(form.role)}
                value={form.specialization || null}
                placeholder={
                  form.role ? "Pick a specialization" : "Pick a role first"
                }
                onChange={(v) =>
                  setForm((f) => ({ ...f, specialization: v ?? "" }))
                }
              />
            </label>

            <div className="fieldset lg:col-start-4">
              <span className="label flex items-center gap-1">
                Secondary Role
                <span
                  className="tooltip"
                  data-tip="Any other roles you're able and willing to help out with, beyond your main one. Not mandatory."
                >
                  <QuestionMarkCircleIcon className="size-4 text-base-content/60" />
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setSecondaryRolePickerOpen(true)}
                >
                  Pick roles...
                </button>
                <span
                  className="truncate text-sm text-base-content/60"
                  title={form.secondary_specialization || undefined}
                >
                  {form.secondary_role
                    ? `${form.secondary_role.split(",").filter((s) => s.trim()).length} picked`
                    : "none picked yet"}
                </span>
              </div>
            </div>
            <label className="fieldset lg:col-start-5">
              <span className="label">Altars</span>
              <Select<string>
                options={ALTAR_OPTIONS}
                value={form.altars || null}
                placeholder="Pick an altar"
                onChange={(v) => setForm((f) => ({ ...f, altars: v ?? "" }))}
              />
            </label>
          </div>

          {/* Column template must stay identical to the grid above (Character
          Name row) - see comment there. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[1fr_48px_1fr_1fr_1fr]">
            <label className="fieldset lg:col-span-2">
              <span className="label">Ascendancy</span>
              <Select<string>
                options={
                  form.ascendancy && !ASCENDANCIES.includes(form.ascendancy)
                    ? [
                        { label: form.ascendancy, value: form.ascendancy },
                        ...ASCENDANCY_OPTIONS,
                      ]
                    : ASCENDANCY_OPTIONS
                }
                value={form.ascendancy || null}
                placeholder="Pick an ascendancy"
                onChange={(v) =>
                  setForm((f) => ({ ...f, ascendancy: v ?? "" }))
                }
              />
            </label>
            <label className="fieldset">
              <span className="label">Main Skill</span>
              <Select<string>
                options={
                  form.main_skill && !SKILL_GEMS.includes(form.main_skill)
                    ? [
                        { label: form.main_skill, value: form.main_skill },
                        ...SKILL_GEM_OPTIONS,
                      ]
                    : SKILL_GEM_OPTIONS
                }
                value={form.main_skill || null}
                placeholder="Pick a skill"
                onChange={(v) =>
                  setForm((f) => ({ ...f, main_skill: v ?? "" }))
                }
              />
            </label>
            <label className="fieldset">
              <span className="label">Guide Link</span>
              <input
                type="text"
                className="input w-full"
                value={form.guide_url ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guide_url: e.target.value }))
                }
              />
            </label>
            <label className="relative fieldset">
              <span className="label flex items-center gap-1">
                PoB
                <span
                  className="tooltip"
                  data-tip="To use Detect uniques, generate your PoB export without sharing (no upload/link) and paste that long text here."
                >
                  <QuestionMarkCircleIcon className="size-4 text-base-content/60" />
                </span>
              </span>
              <input
                type="text"
                className="input w-full"
                value={form.pob_url ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pob_url: e.target.value }))
                }
              />
              <div className="absolute top-full left-0 mt-1 flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-xs"
                  disabled={!form.pob_url || detectingUniques}
                  onClick={handleDetectUniques}
                >
                  {detectingUniques ? "Detecting..." : "Detect uniques"}
                </button>
                {detectUniquesStatus && (
                  <span className="text-xs text-base-content/60">
                    {detectUniquesStatus}
                  </span>
                )}
              </div>
            </label>
          </div>

          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            <div className="fieldset">
              <span className="label">Uniques Needed</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setUniquesPickerOpen(true)}
                >
                  Pick uniques...
                </button>
                <span className="text-sm text-base-content/60">
                  {myUniqueWishes.length
                    ? `${myUniqueWishes.length} picked`
                    : "none picked yet"}
                </span>
              </div>
            </div>
            <div className="fieldset">
              <span className="label">Transfigured Gems</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setGemsPickerOpen(true)}
                >
                  Pick gems...
                </button>
                <span className="text-sm text-base-content/60">
                  {myGemWishCount
                    ? `${myGemWishCount} picked`
                    : "none picked yet"}
                </span>
              </div>
            </div>
            <div className="fieldset">
              <span className="label">Extra Notes</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setExtraNotesOpen(true)}
                >
                  {form.build_notes ? "Edit note..." : "Add note..."}
                </button>
                <span
                  className="truncate text-sm text-base-content/60"
                  title={form.build_notes || undefined}
                >
                  {form.build_notes || "none picked yet"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-lg btn-primary"
            disabled={!!characterNameError}
          >
            Save
          </button>
        </div>
      </form>
      <div className="rounded-box bg-base-300 p-6">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1 text-lg font-semibold"
          onClick={() => setMainRoleChartExpanded((v) => !v)}
        >
          Current distribution of main roles
          {mainRoleChartExpanded ? (
            <ChevronUpIcon className="size-5" />
          ) : (
            <ChevronDownIcon className="size-5" />
          )}
        </button>
        {mainRoleChartExpanded && (
          <div className="mt-4">
            <PieChart
              data={mainRoleData}
              selected={specFilter}
              onSelect={setSpecFilter}
            />
          </div>
        )}
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
        <button
          onClick={() => setHideEmptyPlayers((v) => !v)}
          className={twMerge(
            "btn rounded-lg px-2 btn-sm",
            hideEmptyPlayers
              ? "btn-primary"
              : "border-primary bg-base-100/0 text-primary",
          )}
        >
          Hide players with no data
        </button>
      </div>
      {specFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span>
            Filtered by role:{" "}
            <span className="font-semibold">{specFilter}</span>
          </span>
          <button className="btn btn-xs" onClick={() => setSpecFilter(null)}>
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
        initialNeeded={myUniqueWishes.map((w) => ({
          value: w.value,
          extra: w.extra ?? "",
          buildEnabling: w.build_enabling,
          quantity: w.quantity || 1,
        }))}
        onConfirm={handleUniquesConfirm}
      />
      <GemsPickerModal
        isOpen={gemsPickerOpen}
        setIsOpen={setGemsPickerOpen}
        initialSelected={wishlist
          .filter(
            (w) =>
              w.user_id === user?.id &&
              w.item_field === ItemField.BASE_TYPE &&
              isTransfiguredGem(w.value),
          )
          .map((w) => w.value)}
        onConfirm={handleGemsConfirm}
      />
      <SecondaryRolePickerModal
        isOpen={secondaryRolePickerOpen}
        setIsOpen={setSecondaryRolePickerOpen}
        initialSelectedRoles={
          form.secondary_role
            ? form.secondary_role
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : []
        }
        initialSelectedSpecializations={
          form.secondary_specialization
            ? form.secondary_specialization
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : []
        }
        onConfirm={(roles, specializations) =>
          setForm((f) => ({
            ...f,
            secondary_role: roles.join(", "),
            secondary_specialization: specializations.join(", "),
          }))
        }
      />
      <TextNoteModal
        title="Extra Notes"
        isOpen={extraNotesOpen}
        setIsOpen={setExtraNotesOpen}
        initialValue={form.build_notes ?? ""}
        maxLength={200}
        onConfirm={(value) => setForm((f) => ({ ...f, build_notes: value }))}
      />
    </div>
  );
}
