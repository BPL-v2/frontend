import { Dialog } from "@components/dialog";
import { useFile } from "@api";
import { GlobalStateContext } from "@utils/context-provider";
import { SKILL_GEM_COLORS } from "@mytypes/main-skill";
import { twMerge } from "tailwind-merge";
import { useContext, useEffect, useMemo, useState } from "react";

interface GemsPickerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialSelected: string[];
  onConfirm: (selected: string[]) => void;
}

const MAX_VISIBLE = 10;

export function GemsPickerModal({
  isOpen,
  setIsOpen,
  initialSelected,
  onConfirm,
}: GemsPickerModalProps) {
  const { preferences } = useContext(GlobalStateContext);
  const { data: gems } = useFile<Record<string, string[]>>(
    "/assets/poe1/items/gem_colors.json",
  );

  // Transfigured gems are the "X of Y" alternate-gem-type variants - only
  // those (not every base gem) are worth wishing for, since a player's plain
  // main skill gem is already tracked separately.
  const altGems = useMemo(() => {
    const allGems = new Set<string>(Object.values(gems ?? {}).flat());
    return [...allGems]
      .filter((gem) => {
        const baseGem = gem.split(" of ")[0];
        return baseGem !== gem && allGems.has(baseGem);
      })
      .sort((a, b) => a.localeCompare(b));
  }, [gems]);

  const [search, setSearch] = useState("");
  const [sortBySelected, setSortBySelected] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    setSelected(new Set(initialSelected));
    setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const query = search.toLowerCase();
  const filtered = search
    ? altGems.filter((gem) => gem.toLowerCase().includes(query))
    : altGems;
  const ordered = sortBySelected
    ? [...filtered].sort((a, b) => {
        const aSelected = selected.has(a);
        const bSelected = selected.has(b);
        if (aSelected !== bSelected) return aSelected ? -1 : 1;
        return a.localeCompare(b);
      })
    : filtered;
  const visible = ordered.slice(0, MAX_VISIBLE);

  const toggle = (gem: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(gem)) {
        next.delete(gem);
      } else {
        next.add(gem);
      }
      return next;
    });
  };

  return (
    <Dialog
      title="Pick transfigured gems"
      open={isOpen}
      setOpen={setIsOpen}
      className="max-w-xl"
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            type="search"
            autoFocus
            className="input w-full"
            placeholder="Search gems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="flex cursor-pointer items-center gap-1 text-sm whitespace-nowrap">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={sortBySelected}
              onChange={(e) => setSortBySelected(e.target.checked)}
            />
            Sort by selected
          </label>
        </div>
        <div className="w-full text-left text-sm text-base-content/60">
          {selected.size} selected
          {filtered.length > MAX_VISIBLE &&
            ` — showing first ${MAX_VISIBLE} of ${filtered.length} matches, keep typing to narrow down`}
        </div>
        <div className="flex max-h-[50vh] w-full flex-col gap-1 overflow-y-auto rounded-box border border-base-content/20 p-2">
          {visible.map((gem) => {
            const color = preferences.colorfulMainSkill
              ? SKILL_GEM_COLORS[gem.split(" of ")[0]]
              : undefined;
            return (
              <label
                key={gem}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-base-100"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selected.has(gem)}
                  onChange={() => toggle(gem)}
                />
                <span className={twMerge("truncate text-left", color)}>
                  {gem}
                </span>
              </label>
            );
          })}
        </div>
        <div className="flex w-full flex-row justify-end gap-2">
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
              onConfirm([...selected]);
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
