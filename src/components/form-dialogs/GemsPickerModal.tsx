import { PickerDialog } from "@components/form-dialogs/PickerDialog";
import { useSearchableChecklist } from "@components/form-dialogs/useSearchableChecklist";
import { GlobalStateContext } from "@utils/context-provider";
import { pickColor } from "@utils/color";
import { SKILL_GEM_COLORS } from "@mytypes/main-skill";
import { TRANSFIGURED_SKILL_GEMS } from "@mytypes/skill-gems";
import { twMerge } from "tailwind-merge";
import { useContext, useEffect, useState } from "react";

interface GemsPickerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialSelected: string[];
  onConfirm: (selected: string[]) => void;
}

// Sourced from the same TRANSFIGURED_SKILL_GEMS the sheet's own
// isTransfiguredGem check is built from, so a pick made here can never
// silently disagree with what the sheet's "Transfigured Gems" summary
// recognizes.
const ALT_GEMS = [...TRANSFIGURED_SKILL_GEMS].sort((a, b) =>
  a.localeCompare(b),
);

export function GemsPickerModal({
  isOpen,
  setIsOpen,
  initialSelected,
  onConfirm,
}: GemsPickerModalProps) {
  const { preferences } = useContext(GlobalStateContext);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const {
    search,
    setSearch,
    sortBySelected,
    setSortBySelected,
    filtered,
    visible,
  } = useSearchableChecklist({
    items: ALT_GEMS,
    matches: (gem, query) => gem.toLowerCase().includes(query),
    isSelected: (gem) => selected.has(gem),
    sortKeys: (gem) => [gem],
    isOpen,
  });

  useEffect(() => {
    if (!isOpen) return;
    setSelected(new Set(initialSelected));
    setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
    <PickerDialog
      title="Pick transfigured gems"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="max-w-xl"
      onConfirm={() => onConfirm([...selected])}
    >
      <>
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
          {filtered.length > visible.length &&
            ` — showing first ${visible.length} of ${filtered.length} matches, keep typing to narrow down`}
        </div>
        <div className="flex max-h-[50vh] w-full flex-col gap-1 overflow-y-auto rounded-box border border-base-content/20 p-2">
          {visible.map((gem) => {
            const color = pickColor(
              preferences.colorfulMainSkill,
              SKILL_GEM_COLORS[gem.split(" of ")[0]],
            );
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
      </>
    </PickerDialog>
  );
}
