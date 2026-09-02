import {
  Condition,
  GameVersion,
  ItemField,
  ItemWish,
  Objective,
  Operator,
} from "@api";
import {
  useDeleteItemWish,
  useFile,
  useGetEventStatus,
  useGetRules,
  useGetUser,
  useGetUsers,
  useGetWishlist,
  useUpdateItemWish,
} from "@api";
import { ObjectiveIcon } from "@components/objective-icon";
import Table from "@components/table/table";
import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@components/table/react-table-shim";
import { GlobalStateContext } from "@utils/context-provider";
import { flatMap } from "@utils/utils";
import { useContext, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ItemWishFormModal } from "@components/form-dialogs/ItemWishFormModal";
import {
  BuildEnablingLegend,
  BuildEnablingRating,
} from "@components/build-enabling-rating";
import { BUILD_ENABLING_THRESHOLD } from "@mytypes/item-wish";
import { stripFoulbornName } from "@mytypes/scoring-objective";

export const Route = createFileRoute("/team/wishlist")({
  component: RouteComponent,
});

type UniqueInfo = {
  condition: Condition;
  tier: number | null;
  is_drop_restricted: boolean | null;
  is_point_unique: boolean;
  foulbornMods: string[] | null;
};

type WishRow = {
  user: string;
  wish: ItemWish;
  uniqueInfo: UniqueInfo;
};

function RouteComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemFilter, setItemfilter] = useState<string>("");
  const [gemsOnly, setGemsOnly] = useState(false);
  const [uniquesOnly, setUniquesOnly] = useState(false);
  const [buildEnablingOnly, setBuildEnablingOnly] = useState(false);
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { rules } = useGetRules(currentEvent.id);
  const { data: uniques } = useFile<
    Record<string, { base_type: string; is_drop_restricted: boolean }>
  >("/assets/poe1/items/uniques.json");
  const { data: uniqueTiers = {} } = useFile<Record<string, number>>(
    "/assets/poe1/items/unique_tiers.json",
  );
  const { data: foulbornEntries } = useFile<{ name: string; mod: string }[]>(
    "/assets/poe1/items/foulborn_uniques.json",
  );
  const foulbornModsByName = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const entry of foulbornEntries ?? []) {
      (map[entry.name] ??= []).push(entry.mod);
    }
    return map;
  }, [foulbornEntries]);
  const pointUniques = flatMap(rules)
    .map((obj) => {
      for (const condition of obj.conditions) {
        if (
          condition.field === ItemField.NAME &&
          condition.operator === Operator.EQ
        ) {
          return condition.value;
        }
      }
      return null;
    })
    .filter((i) => i !== null);
  const { users = [] } = useGetUsers(currentEvent.id);
  const { user } = useGetUser();

  const { wishlist = [] } = useGetWishlist(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const qc = useQueryClient();
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

  const userMap = users.reduce(
    (acc, user) => {
      acc[user.id] = user;
      return acc;
    },
    {} as Record<number, (typeof users)[number]>,
  );
  const rowMap = {} as Record<
    number,
    { wish: ItemWish; uniqueInfo: UniqueInfo }[]
  >;
  for (const wish of wishlist) {
    if (!rowMap[wish.user_id]) {
      rowMap[wish.user_id] = [];
    }
    const baseName = stripFoulbornName(wish.value);
    const itemInfo = {
      condition: {
        field: wish.item_field,
        operator: Operator.EQ,
        value: wish.value.trim(),
      },
      tier: uniqueTiers[baseName],
      is_drop_restricted: uniques
        ? uniques[baseName]?.is_drop_restricted
        : null,
      is_point_unique: pointUniques.includes(baseName),
      foulbornMods: wish.value.startsWith("Foulborn ")
        ? wish.extra
          ? [wish.extra]
          : (foulbornModsByName[baseName] ?? null)
        : null,
    };
    rowMap[wish.user_id].push({ wish: wish, uniqueInfo: itemInfo });
  }
  const rows: WishRow[] = [];
  for (const [userId, wishes] of Object.entries(rowMap)) {
    const user = userMap[Number(userId)];
    if (!user) {
      continue;
    }
    for (const wish of wishes) {
      rows.push({
        user: user?.display_name,
        wish: wish.wish,
        uniqueInfo: wish.uniqueInfo,
      });
    }
  }
  const columns: ColumnDef<WishRow>[] = [
    {
      header: "",
      accessorKey: "user",
      filterFn: "includesString",
      enableSorting: false,
      meta: {
        filterVariant: "string",
        filterPlaceholder: "User",
      },
    },
    {
      header: "",
      accessorKey: "uniqueInfo.condition.value",
      size: 320,
      filterFn: "includesString",
      cell: (info) => {
        const { condition, foulbornMods } = info.row.original.uniqueInfo;
        return (
          <div className="flex w-72 items-center gap-2">
            <ObjectiveIcon
              className="max-h-8 max-w-8 shrink-0"
              objective={
                {
                  conditions: [condition],
                } as Objective
              }
              gameVersion={GameVersion.poe1}
            />
            <span className="flex min-w-0 flex-col text-left">
              <span className="truncate" title={condition.value}>
                {condition.value}
              </span>
              {foulbornMods && (
                <span
                  className="truncate text-xs text-secondary"
                  title={foulbornMods.join(" / ")}
                >
                  {foulbornMods.join(" / ")}
                </span>
              )}
            </span>
          </div>
        );
      },
      enableSorting: false,
      meta: {
        filterVariant: "string",
        filterPlaceholder: "Wish",
      },
    },
    {
      header: "Qty",
      id: "quantity",
      size: 100,
      accessorKey: "wish.quantity",
      cell: (info) => {
        const quantity = info.row.original.wish.quantity;
        if (!quantity || quantity < 2) {
          return;
        }
        return <span className="font-bold text-error">×{quantity}</span>;
      },
    },
    {
      header: "Tier",
      accessorKey: "uniqueInfo.tier",
      size: 80,
      cell: (info) => {
        const tier = info.row.original.uniqueInfo.tier;
        if (tier === null || tier === undefined) {
          return;
        }
        return (
          <span
            className={twMerge(
              "font-bold text-success",
              tier < 4 ? "text-warning" : "",
              tier < 2 ? "text-error" : "",
            )}
          >
            {tier}
          </span>
        );
      },
    },
    {
      header: "Point Item",
      accessorKey: "uniqueInfo.is_point_unique",
      size: 140,
      cell: (info) => {
        return info.row.original.uniqueInfo.is_point_unique ? (
          <ExclamationCircleIcon className="size-5 text-error" />
        ) : null;
      },
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          Build Enabling
          <BuildEnablingLegend />
        </span>
      ),
      id: "build_enabling",
      accessorFn: (row) => row.wish.build_enabling,
      size: 170,
      cell: (info) => {
        const wish = info.row.original.wish;
        const isOwn = user?.display_name == info.row.original.user;
        return (
          <BuildEnablingRating
            name={`build-enabling-${wish.id}`}
            value={wish.build_enabling}
            onChange={
              isOwn
                ? (level) => {
                    wish.build_enabling = level;
                    updateItemWish(wish.id, { build_enabling: level });
                  }
                : undefined
            }
          />
        );
      },
    },
    {
      header: "Fulfilled",
      accessorKey: "wish.fulfilled",
      size: 100,
      cell: (info) => {
        const isOwn = user?.display_name == info.row.original.user;
        return (
          <input
            type="checkbox"
            defaultChecked={info.row.original.wish.fulfilled}
            tabIndex={isOwn ? 0 : -1}
            className={twMerge(
              "checkbox border-2",
              !isOwn ? "pointer-events-none" : "",
              !isOwn && !info.row.original.wish.fulfilled ? "opacity-40" : "",
              info.row.original.wish.fulfilled ? "checkbox-success" : "",
            )}
            onChange={async (e) => {
              if (!isOwn) return;
              updateItemWish(info.row.original.wish.id, {
                fulfilled: e.target.checked,
              });
            }}
          />
        );
      },
      enableSorting: false,
    },
    {
      header: "",
      id: "delete",
      cell: (info) => {
        return (
          user?.display_name == info.row.original.user && (
            <button onClick={() => deleteItemWish(info.row.original.wish.id)}>
              <TrashIcon className="size-5 cursor-pointer text-error" />
            </button>
          )
        );
      },
      size: 60,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-row gap-4">
        <input
          type="search"
          className="input"
          placeholder="Paste item to see if anyone wants it..."
          value={itemFilter}
          onPaste={(e) => {
            const paste = e.clipboardData.getData("text");
            if (paste.split("\n").length > 2) {
              setItemfilter(paste.split("\n")[2].trim());
              e.preventDefault();
            }
          }}
          onChange={(e) => setItemfilter(e.target.value)}
        />
        <button className="btn mb-4" onClick={() => setDialogOpen(true)}>
          Add Item Wish
        </button>
        <button
          className={twMerge(
            "btn btn-sm",
            gemsOnly
              ? "btn-primary"
              : "border-primary bg-base-100/0 text-primary",
          )}
          onClick={() => setGemsOnly((v) => !v)}
        >
          Gems
        </button>
        <button
          className={twMerge(
            "btn btn-sm",
            uniquesOnly
              ? "btn-primary"
              : "border-primary bg-base-100/0 text-primary",
          )}
          onClick={() => setUniquesOnly((v) => !v)}
        >
          Uniques
        </button>
        <button
          title={`Show only wishes rated ${BUILD_ENABLING_THRESHOLD}+ for build enabling`}
          className={twMerge(
            "btn btn-sm",
            buildEnablingOnly
              ? "btn-primary"
              : "border-primary bg-base-100/0 text-primary",
          )}
          onClick={() => setBuildEnablingOnly((v) => !v)}
        >
          Build enabling
        </button>
      </div>
      <ItemWishFormModal
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        eventId={currentEvent.id}
        teamId={eventStatus?.team_id}
      />
      <Table
        className="max-h-[70vh]"
        columns={columns}
        data={rows
          .filter((row) => {
            if (
              buildEnablingOnly &&
              row.wish.build_enabling < BUILD_ENABLING_THRESHOLD
            ) {
              return false;
            }
            if (gemsOnly || uniquesOnly) {
              const matchesGems =
                gemsOnly && row.wish.item_field === ItemField.BASE_TYPE;
              const matchesUniques =
                uniquesOnly && row.wish.item_field === ItemField.NAME;
              if (!matchesGems && !matchesUniques) {
                return false;
              }
            }
            if (!itemFilter) {
              return true;
            }
            return (
              row.wish.value.toLowerCase().includes(itemFilter.toLowerCase()) &&
              !row.wish.fulfilled
            );
          })
          .sort((a, b) => {
            if (a.user == user?.display_name) {
              return -1;
            }
            if (b.user == user?.display_name) {
              return 1;
            }

            if (a.user != b.user) {
              return a.user.localeCompare(b.user);
            }
            return (
              a.wish.value.localeCompare(b.wish.value) ||
              (a.wish.extra ?? "").localeCompare(b.wish.extra ?? "")
            );
          })}
      />
    </div>
  );
}
