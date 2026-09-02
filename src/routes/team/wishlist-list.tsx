import { Condition, GameVersion, ItemField, Objective, Operator } from "@api";
import { useGetEventStatus, useGetUsers, useGetWishlist } from "@api";
import { ObjectiveIcon } from "@components/objective-icon";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { createFileRoute } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/team/wishlist-list")({
  component: RouteComponent,
});

type Contributor = {
  name: string;
  quantity: number;
};

type SummaryEntry = {
  value: string;
  extra: string;
  quantity: number;
  contributors: Contributor[];
};

function summarize(
  wishlist: {
    item_field: ItemField;
    value: string;
    extra?: string;
    fulfilled: boolean;
    quantity: number;
    user_id: number;
  }[],
  itemField: ItemField,
  userNames: Record<number, string>,
): SummaryEntry[] {
  const totals = new Map<string, SummaryEntry>();
  for (const wish of wishlist) {
    if (wish.item_field !== itemField || wish.fulfilled) {
      continue;
    }
    const extra = wish.extra ?? "";
    const key = JSON.stringify([wish.value, extra]);
    const quantity = wish.quantity || 1;
    const existing = totals.get(key);
    const contributor = {
      name: userNames[wish.user_id] ?? `User #${wish.user_id}`,
      quantity,
    };
    if (existing) {
      existing.quantity += quantity;
      existing.contributors.push(contributor);
    } else {
      totals.set(key, {
        value: wish.value,
        extra,
        quantity,
        contributors: [contributor],
      });
    }
  }
  return Array.from(totals.values());
}

function RouteComponent() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { users = [] } = useGetUsers(currentEvent.id);
  const { wishlist = [] } = useGetWishlist(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const [itemField, setItemField] = useState<ItemField>(ItemField.NAME);
  const [sortByCount, setSortByCount] = useState(false);

  const userNames = useMemo(
    () =>
      users.reduce(
        (acc, u) => {
          acc[u.id] = u.display_name;
          return acc;
        },
        {} as Record<number, string>,
      ),
    [users],
  );

  const entries = useMemo(() => {
    const summary = summarize(wishlist, itemField, userNames);
    return summary.sort((a, b) =>
      sortByCount
        ? b.quantity - a.quantity ||
          a.value.localeCompare(b.value) ||
          a.extra.localeCompare(b.extra)
        : a.value.localeCompare(b.value) || a.extra.localeCompare(b.extra),
    );
  }, [wishlist, itemField, userNames, sortByCount]);

  if (!eventStatus?.team_id) {
    return <div className="p-4">You need to be on a team to see this.</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            className={twMerge(
              "btn btn-sm",
              itemField === ItemField.NAME
                ? "btn-primary"
                : "border-primary bg-base-100/0 text-primary",
            )}
            onClick={() => setItemField(ItemField.NAME)}
          >
            Uniques
          </button>
          <button
            className={twMerge(
              "btn btn-sm",
              itemField === ItemField.BASE_TYPE
                ? "btn-primary"
                : "border-primary bg-base-100/0 text-primary",
            )}
            onClick={() => setItemField(ItemField.BASE_TYPE)}
          >
            Gems
          </button>
        </div>
        <button
          title="Sort by most needed"
          className={twMerge(
            "btn btn-square btn-sm",
            sortByCount
              ? "btn-primary"
              : "border-primary bg-base-100/0 text-primary",
          )}
          onClick={() => setSortByCount((v) => !v)}
        >
          <ArrowsUpDownIcon className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-2 rounded-box bg-base-300 p-4">
        {entries.length === 0 ? (
          <div className="text-sm text-base-content/60">
            Nothing needed right now.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-base-content/10">
            {entries.map((entry) => {
              const condition: Condition = {
                field: itemField,
                operator: Operator.EQ,
                value: entry.value.trim(),
              };
              const breakdown = entry.contributors
                .map((c) => `${c.name}: ${c.quantity}`)
                .join(", ");
              return (
                <div
                  key={`${entry.value}-${entry.extra}`}
                  className="flex items-center gap-2 py-1.5"
                  title={breakdown}
                >
                  <ObjectiveIcon
                    className="max-h-8 max-w-8"
                    objective={{ conditions: [condition] } as Objective}
                    gameVersion={GameVersion.poe1}
                  />
                  <span className="grow">
                    {entry.value}
                    {entry.extra && (
                      <span className="text-secondary"> ({entry.extra})</span>
                    )}
                  </span>
                  <span
                    className={twMerge(
                      "cursor-help font-bold",
                      entry.quantity > 1 ? "text-error" : "",
                    )}
                  >
                    ×{entry.quantity}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
