import { Dialog } from "@components/dialog";
import { useFile } from "@api";
import { encode } from "@mytypes/scoring-objective";
import { useEffect, useState } from "react";

interface UniqueSelection {
  needed: boolean;
  buildEnabling: boolean;
}

interface UniquesPickerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialNeeded: string[];
  initialBuildEnabling: Set<string>;
  onConfirm: (needed: string[], buildEnabling: Set<string>) => void;
}

const MAX_VISIBLE = 10;

export function UniquesPickerModal({
  isOpen,
  setIsOpen,
  initialNeeded,
  initialBuildEnabling,
  onConfirm,
}: UniquesPickerModalProps) {
  const { data: uniques } = useFile<
    Record<string, { base_type: string; is_drop_restricted: boolean }>
  >("/assets/poe1/items/uniques.json");

  const [search, setSearch] = useState("");
  const [sortBySelected, setSortBySelected] = useState(false);
  const [selection, setSelection] = useState<Record<string, UniqueSelection>>(
    {},
  );

  useEffect(() => {
    if (!isOpen) return;
    const initial: Record<string, UniqueSelection> = {};
    for (const name of initialNeeded) {
      initial[name] = {
        needed: true,
        buildEnabling: initialBuildEnabling.has(name),
      };
    }
    setSelection(initial);
    setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const allNames = Object.keys(uniques ?? {}).sort();
  const filtered = search
    ? allNames.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase()),
      )
    : allNames;
  const ordered = sortBySelected
    ? [...filtered].sort((a, b) => {
        const aSelected = !!selection[a]?.needed;
        const bSelected = !!selection[b]?.needed;
        if (aSelected !== bSelected) return aSelected ? -1 : 1;
        return a.localeCompare(b);
      })
    : filtered;
  const visible = ordered.slice(0, MAX_VISIBLE);

  const toggleNeeded = (name: string) => {
    setSelection((prev) => {
      const current = prev[name];
      if (current?.needed) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: { needed: true, buildEnabling: false } };
    });
  };

  const toggleBuildEnabling = (name: string) => {
    setSelection((prev) => ({
      ...prev,
      [name]: {
        needed: true,
        buildEnabling: !prev[name]?.buildEnabling,
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
          {visible.map((name) => {
            const sel = selection[name];
            return (
              <div
                key={name}
                className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-base-100"
              >
                <img
                  src={`/assets/poe1/items/uniques/${encode(name)}.webp`}
                  alt=""
                  className="size-8 shrink-0 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility =
                      "hidden";
                  }}
                />
                <span className="grow truncate">{name}</span>
                <label className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={!!sel?.needed}
                    onChange={() => toggleNeeded(name)}
                  />
                  Needed
                </label>
                <label className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    disabled={!sel?.needed}
                    checked={!!sel?.buildEnabling}
                    onChange={() => toggleBuildEnabling(name)}
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
              const needed = Object.entries(selection)
                .filter(([, s]) => s.needed)
                .map(([name]) => name);
              const buildEnabling = new Set(
                Object.entries(selection)
                  .filter(([, s]) => s.needed && s.buildEnabling)
                  .map(([name]) => name),
              );
              onConfirm(needed, buildEnabling);
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
