import { PickerDialog } from "@components/form-dialogs/PickerDialog";
import { useSearchableChecklist } from "@components/form-dialogs/useSearchableChecklist";
import {
  BuildEnablingLegend,
  BuildEnablingRating,
} from "@components/build-enabling-rating";
import { GlobalStateContext } from "@utils/context-provider";
import { pickColor } from "@utils/color";
import { DEFAULT_BUILD_ENABLING } from "@mytypes/item-wish";
import { SKILL_GEM_COLORS } from "@mytypes/main-skill";
import { TRANSFIGURED_SKILL_GEMS } from "@mytypes/skill-gems";
import { twMerge } from "tailwind-merge";
import { useContext, useEffect, useState } from "react";

export interface NeededGem {
  value: string;
  // 1-5 importance scale, see @mytypes/item-wish.
  buildEnabling: number;
  quantity: number;
}

interface GemsPickerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialNeeded: NeededGem[];
  onConfirm: (needed: NeededGem[]) => void;
}

const MAX_QUANTITY = 5;

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
  initialNeeded,
  onConfirm,
}: GemsPickerModalProps) {
  const { preferences } = useContext(GlobalStateContext);

  const [selection, setSelection] = useState<Record<string, NeededGem>>({});
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
    isSelected: (gem) => !!selection[gem],
    sortKeys: (gem) => [gem],
    isOpen,
  });

  useEffect(() => {
    if (!isOpen) return;
    const initial: Record<string, NeededGem> = {};
    for (const n of initialNeeded) {
      initial[n.value] = {
        value: n.value,
        buildEnabling: n.buildEnabling || DEFAULT_BUILD_ENABLING,
        quantity: n.quantity || 1,
      };
    }
    setSelection(initial);
    setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggleNeeded = (gem: string) => {
    setSelection((prev) => {
      if (prev[gem]) {
        const next = { ...prev };
        delete next[gem];
        return next;
      }
      return {
        ...prev,
        [gem]: {
          value: gem,
          buildEnabling: DEFAULT_BUILD_ENABLING,
          quantity: 1,
        },
      };
    });
  };

  const updateSelection = (
    gem: string,
    patch: Partial<Pick<NeededGem, "buildEnabling" | "quantity">>,
  ) => {
    setSelection((prev) =>
      prev[gem] ? { ...prev, [gem]: { ...prev[gem], ...patch } } : prev,
    );
  };

  const setQuantity = (gem: string, quantity: number) =>
    updateSelection(gem, {
      quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity || 1)),
    });

  const neededCount = Object.keys(selection).length;

  return (
    <PickerDialog
      title="Pick transfigured gems"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="max-w-3xl"
      onConfirm={() => onConfirm(Object.values(selection))}
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
        <div className="flex items-center gap-1 text-sm text-base-content/60">
          <span>
            {neededCount} selected
            {filtered.length > visible.length &&
              ` — showing first ${visible.length} of ${filtered.length} matches, keep typing to narrow down`}
          </span>
          <span className="ml-auto flex items-center gap-1">
            Build enabling scale
            <BuildEnablingLegend />
          </span>
        </div>
        <div className="flex max-h-[50vh] w-full flex-col gap-1 overflow-y-auto rounded-box border border-base-content/20 p-2">
          {visible.map((gem) => {
            const sel = selection[gem];
            const color = pickColor(
              preferences.colorfulMainSkill,
              SKILL_GEM_COLORS[gem.split(" of ")[0]],
            );
            return (
              <div
                key={gem}
                className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-base-100"
              >
                <span className={twMerge("grow truncate text-left", color)}>
                  {gem}
                </span>
                <label className="flex cursor-pointer items-center gap-1 text-sm whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={!!sel}
                    onChange={() => toggleNeeded(gem)}
                  />
                  Needed
                </label>
                <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                  ×
                  <input
                    type="number"
                    min={1}
                    max={MAX_QUANTITY}
                    disabled={!sel}
                    className="input w-14 input-sm"
                    value={sel?.quantity || 1}
                    onChange={(e) => setQuantity(gem, e.target.valueAsNumber)}
                  />
                </label>
                <span
                  className={twMerge(
                    "flex items-center gap-1 text-sm whitespace-nowrap",
                    sel ? "" : "pointer-events-none opacity-40",
                  )}
                >
                  <span className="text-base-content/60">Build enabling</span>
                  <BuildEnablingRating
                    size="xs"
                    name={`gem-picker-build-enabling-${gem}`}
                    value={sel?.buildEnabling || DEFAULT_BUILD_ENABLING}
                    onChange={
                      sel
                        ? (level) =>
                            updateSelection(gem, { buildEnabling: level })
                        : undefined
                    }
                  />
                </span>
              </div>
            );
          })}
        </div>
      </>
    </PickerDialog>
  );
}
