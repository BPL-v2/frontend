import { Dialog } from "@components/dialog";
import { useFile } from "@api";
import { encode } from "@mytypes/scoring-objective";
import { useEffect, useMemo, useState } from "react";

// A wish for a specific unique, optionally disambiguated by `extra` (e.g.
// which of several possible Foulborn mods on the same base item). `value`
// is always a real in-game item name ("Abyssus" or "Foulborn Abyssus"),
// never the mod text, so it stays matchable against real items - `extra`
// is the only place a mod description may live.
export interface NeededUnique {
  value: string;
  extra: string;
  buildEnabling: boolean;
  quantity: number;
}

interface UniqueSelection {
  needed: boolean;
  buildEnabling: boolean;
  quantity: number;
  value: string;
  extra: string;
}

interface FoulbornEntry {
  name: string;
  mod: string;
}

interface PickerRow {
  key: string;
  value: string;
  extra: string;
  displayName: string;
  modText?: string;
  // Base unique name to resolve the icon (and any other Cargo-sourced data)
  // from uniques.json - Foulborn rows never carry their own copy of it.
  iconName: string;
}

function rowKey(value: string, extra: string): string {
  return extra ? `${value} - ${extra}` : value;
}

interface UniquesPickerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialNeeded: NeededUnique[];
  onConfirm: (needed: NeededUnique[]) => void;
}

const MAX_VISIBLE = 10;
const MAX_QUANTITY = 5;

export function UniquesPickerModal({
  isOpen,
  setIsOpen,
  initialNeeded,
  onConfirm,
}: UniquesPickerModalProps) {
  const { data: uniques } = useFile<
    Record<string, { base_type: string; is_drop_restricted: boolean }>
  >("/assets/poe1/items/uniques.json");
  const { data: foulbornEntries } = useFile<FoulbornEntry[]>(
    "/assets/poe1/items/foulborn_uniques.json",
  );

  const [search, setSearch] = useState("");
  const [sortBySelected, setSortBySelected] = useState(false);
  const [selection, setSelection] = useState<Record<string, UniqueSelection>>(
    {},
  );

  useEffect(() => {
    if (!isOpen) return;
    const initial: Record<string, UniqueSelection> = {};
    for (const n of initialNeeded) {
      initial[rowKey(n.value, n.extra)] = {
        needed: true,
        buildEnabling: n.buildEnabling,
        quantity: n.quantity || 1,
        value: n.value,
        extra: n.extra,
      };
    }
    setSelection(initial);
    setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const allRows = useMemo(() => {
    const regular: PickerRow[] = Object.keys(uniques ?? {}).map((name) => ({
      key: rowKey(name, ""),
      value: name,
      extra: "",
      displayName: name,
      iconName: name,
    }));
    const foulborn: PickerRow[] = (foulbornEntries ?? []).map((entry) => {
      const value = `Foulborn ${entry.name}`;
      return {
        key: rowKey(value, entry.mod),
        value,
        extra: entry.mod,
        displayName: value,
        modText: entry.mod,
        iconName: entry.name,
      };
    });
    return [...regular, ...foulborn].sort(
      (a, b) =>
        a.displayName.localeCompare(b.displayName) ||
        (a.modText ?? "").localeCompare(b.modText ?? ""),
    );
  }, [uniques, foulbornEntries]);

  if (!isOpen) {
    return null;
  }

  const query = search.toLowerCase();
  const filtered = search
    ? allRows.filter(
        (row) =>
          row.displayName.toLowerCase().includes(query) ||
          row.modText?.toLowerCase().includes(query),
      )
    : allRows;
  const ordered = sortBySelected
    ? [...filtered].sort((a, b) => {
        const aSelected = !!selection[a.key]?.needed;
        const bSelected = !!selection[b.key]?.needed;
        if (aSelected !== bSelected) return aSelected ? -1 : 1;
        return (
          a.displayName.localeCompare(b.displayName) ||
          (a.modText ?? "").localeCompare(b.modText ?? "")
        );
      })
    : filtered;
  const visible = ordered.slice(0, MAX_VISIBLE);

  const toggleNeeded = (row: PickerRow) => {
    setSelection((prev) => {
      const current = prev[row.key];
      if (current?.needed) {
        const next = { ...prev };
        delete next[row.key];
        return next;
      }
      return {
        ...prev,
        [row.key]: {
          needed: true,
          buildEnabling: false,
          quantity: 1,
          value: row.value,
          extra: row.extra,
        },
      };
    });
  };

  const toggleBuildEnabling = (row: PickerRow) => {
    setSelection((prev) => ({
      ...prev,
      [row.key]: {
        needed: true,
        buildEnabling: !prev[row.key]?.buildEnabling,
        quantity: prev[row.key]?.quantity || 1,
        value: row.value,
        extra: row.extra,
      },
    }));
  };

  const setQuantity = (row: PickerRow, quantity: number) => {
    setSelection((prev) => ({
      ...prev,
      [row.key]: {
        needed: true,
        buildEnabling: !!prev[row.key]?.buildEnabling,
        quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity || 1)),
        value: row.value,
        extra: row.extra,
      },
    }));
  };

  const neededCount = Object.values(selection).filter((s) => s.needed).length;

  return (
    <Dialog
      title="Pick uniques needed"
      open={isOpen}
      setOpen={setIsOpen}
      className="max-w-3xl"
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            type="search"
            autoFocus
            className="input w-full"
            placeholder="Search uniques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={sortBySelected}
              onChange={(e) => setSortBySelected(e.target.checked)}
            />
            Sort by selected
          </label>
        </div>
        <div className="text-sm text-base-content/60">
          {neededCount} selected
          {filtered.length > MAX_VISIBLE &&
            ` — showing first ${MAX_VISIBLE} of ${filtered.length} matches, keep typing to narrow down`}
        </div>
        <div className="flex max-h-[50vh] w-full flex-col gap-1 overflow-y-auto rounded-box border border-base-content/20 p-2">
          {visible.map((row) => {
            const sel = selection[row.key];
            const title = row.modText
              ? `${row.displayName} (${row.modText})`
              : row.displayName;
            return (
              <div
                key={row.key}
                className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-base-100"
              >
                <img
                  src={`/assets/poe1/items/uniques/${encode(row.iconName)}.webp`}
                  alt=""
                  className="size-8 shrink-0 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility =
                      "hidden";
                  }}
                />
                <span className="grow truncate" title={title}>
                  {row.displayName}
                  {row.modText && (
                    <span className="text-secondary"> ({row.modText})</span>
                  )}
                </span>
                <label className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={!!sel?.needed}
                    onChange={() => toggleNeeded(row)}
                  />
                  Needed
                </label>
                <label className="flex items-center gap-1 whitespace-nowrap text-sm">
                  ×
                  <input
                    type="number"
                    min={1}
                    max={MAX_QUANTITY}
                    disabled={!sel?.needed}
                    className="input input-sm w-14"
                    value={sel?.quantity || 1}
                    onChange={(e) =>
                      setQuantity(row, e.target.valueAsNumber)
                    }
                  />
                </label>
                <label className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    disabled={!sel?.needed}
                    checked={!!sel?.buildEnabling}
                    onChange={() => toggleBuildEnabling(row)}
                  />
                  Build enabling
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row justify-end gap-2">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const needed: NeededUnique[] = Object.values(selection)
                .filter((s) => s.needed)
                .map((s) => ({
                  value: s.value,
                  extra: s.extra,
                  buildEnabling: s.buildEnabling,
                  quantity: s.quantity || 1,
                }));
              onConfirm(needed);
              setIsOpen(false);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
}
