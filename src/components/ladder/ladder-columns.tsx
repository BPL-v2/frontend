import { Event, LadderEntry, Team } from "@api";
import { AscendancyName } from "@components/character/ascendancy-name";
import { AscendancyPortrait } from "@components/character/ascendancy-portrait";
import { ExperienceBar } from "@components/character/experience-bar";
import {
  ActivityDot,
  LadderPortrait,
} from "@components/character/ladder-portrait";
import {
  CellContext,
  ColumnDef,
  sortingFns,
} from "@components/table/react-table-shim";
import { TeamName } from "@components/team/team-name";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { getGemColor } from "@utils/gem-utils";
import { TwitchFilled } from "@icons/twitch";
import { progressiveDelveDepth, totalPoPoints } from "@utils/personal-points";

type LadderColumn = ColumnDef<LadderEntry>;
type TeamLookup = (userId: number | undefined) => Team | undefined;

export function rankColumn(): LadderColumn {
  return { id: "Rank", accessorKey: "rank", header: "#", size: 50 };
}

export function accountColumn(): LadderColumn {
  return {
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
    meta: { filterVariant: "string", filterPlaceholder: "Account" },
  };
}

export function characterColumn(event: Event): LadderColumn {
  return {
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
          eventId: event.id,
        }}
      >
        <ArrowTopRightOnSquareIcon className="inline size-4" />
        {info.row.original.character_name}
      </Link>
    ),
  };
}

export function teamColumn(event: Event, getTeam: TeamLookup): LadderColumn {
  return {
    id: "Team",
    accessorFn: (row) => getTeam(row.user_id)?.name,
    header: " ",
    cell: (info) => <TeamName team={getTeam(info.row.original.user_id)} />,
    enableSorting: false,
    size: 200,
    filterFn: "includesString",
    meta: {
      filterVariant: "enum",
      filterPlaceholder: "Team",
      options: event.teams.map((team) => team.name),
    },
  };
}

export function ascendancyColumn(event: Event): LadderColumn {
  return {
    id: "Ascendancy",
    accessorFn: (row) => row.ascendancy + row.main_skill,
    header: "",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <AscendancyPortrait
            character_class={info.row.original.ascendancy}
            game_version={event.game_version}
            className="size-10 rounded-full object-cover"
          />
          <ActivityDot
            last_active={info.row.original.last_active}
            className="absolute top-0 right-0 size-2.5"
          />
        </div>
        <div className="flex flex-col">
          <span className={getGemColor(info.row.original.main_skill)}>
            {info.row.original.main_skill}
          </span>
          <AscendancyName
            character_class={info.row.original.ascendancy}
            game_version={event.game_version}
          />
        </div>
      </div>
    ),
    size: 300,
    filterFn: "includesString",
    enableSorting: false,
    meta: {
      align: "left",
      filterVariant: "string",
      filterPlaceholder: "Ascendancy / Skill",
    },
  };
}

export function levelColumn(): LadderColumn {
  return {
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
  };
}

const STAT_NAMES = [
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
];

function statColumns(): LadderColumn[] {
  return STAT_NAMES.map((stat) => {
    const key = stat.replaceAll(" ", "_").toLowerCase() as keyof LadderEntry;
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
        if (value === undefined) return 0;
        if (value === 2147483647) return "inf";
        return value.toLocaleString();
      },
      size: 110,
      sortFn: sortingFns.basic,
      meta: { filterVariant: "number" },
    };
  });
}

function checkOrCross(ok: boolean) {
  return ok ? (
    <CheckCircleIcon className="size-6 text-success" />
  ) : (
    <XCircleIcon className="size-6 text-error" />
  );
}

/** Delve depth, stats, P.O. and the remaining progress columns of the full ladder. */
export function progressColumns(): LadderColumn[] {
  return [
    { id: "Delve", accessorKey: "delve", header: "Delve", size: 100 },
    ...statColumns(),
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
      cell: (info) => checkOrCross(!!info.row.original.pantheon),
      enableSorting: false,
      meta: { filterVariant: "boolean" },
    },
    {
      id: "Uber Lab",
      header: "Uber Lab",
      accessorFn: (row) => (row.ascendancy_points || 0) > 6,
      cell: (info) =>
        checkOrCross((info.row.original.ascendancy_points || 0) > 6),
      enableSorting: false,
      meta: { filterVariant: "boolean" },
    },
    {
      id: "Atlas",
      accessorFn: (row) => row.atlas_points || 0,
      header: "Atlas",
    },
  ];
}

/** Single searchable portrait column used on mobile. */
export function mobilePortraitColumn(
  event: Event,
  getTeam: TeamLookup,
  {
    id,
    searchText,
    placeholder,
    size,
    enableSorting = false,
  }: {
    id?: string;
    searchText: (row: LadderEntry) => string;
    placeholder: string;
    size: number;
    enableSorting?: boolean;
  },
): LadderColumn {
  return {
    id,
    accessorFn: searchText,
    header: " ",
    filterFn: "includesString",
    meta: { filterVariant: "string", filterPlaceholder: placeholder },
    cell: (info) => (
      <LadderPortrait
        entry={info.row.original}
        team={getTeam(info.row.original.user_id)}
        event={event}
      />
    ),
    enableSorting,
    size,
  };
}

export function streamColumn(
  streamsByUser: Record<number, unknown>,
): LadderColumn {
  return {
    id: "Stream",
    header: "",
    cell: (info) =>
      streamsByUser[info.row.original.user_id || 0] &&
      info.row.original.twitch_name && (
        <Link
          to={"/streams/$twitchAccount"}
          params={{ twitchAccount: info.row.original.twitch_name || "" }}
        >
          <TwitchFilled className="size-5" brandColor />
        </Link>
      ),
    enableSorting: false,
    size: 30,
    meta: { filterVariant: "boolean" },
  };
}

type DiscordUser = { discord_name?: string; discord_id?: string };

export function discordColumn(
  userMap: Record<number, DiscordUser | undefined>,
): LadderColumn {
  const getUser = (userId: number | undefined) => {
    const user = userMap[userId || 0];
    return user?.discord_name && user.discord_id ? user : undefined;
  };
  return {
    id: "Discord",
    accessorFn: (row) => {
      const user = getUser(row.user_id);
      return user ? user.discord_name + `#` + user.discord_id : "";
    },
    header: "",
    cell: (info) => {
      const user = getUser(info.row.original.user_id);
      if (!user) return "null";
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
    meta: { filterVariant: "string", filterPlaceholder: "Discord" },
  };
}

/** Delve depth; the desktop variant also shows the progressive depth bonus. */
export function delveDepthColumn({
  showProgressive,
}: {
  showProgressive: boolean;
}): LadderColumn {
  return {
    accessorKey: "delve_depth",
    header: "Depth",
    sortFn: sortingFns.basic,
    size: 100,
    ...(showProgressive && {
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.delve_depth}
          {progressiveDelveDepth(row.original) > 0 && (
            <span className="text-sm text-success">
              ({progressiveDelveDepth(row.original)})
            </span>
          )}
        </div>
      ),
    }),
  };
}
