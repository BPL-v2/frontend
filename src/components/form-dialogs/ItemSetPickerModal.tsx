import { PickerDialog } from "@components/form-dialogs/PickerDialog";
import { ItemSetInfo } from "@utils/pob";
import { useEffect, useState } from "react";

interface ItemSetPickerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemSets: ItemSetInfo[];
  onConfirm: (selectedSetIds: string[]) => void;
}

export function ItemSetPickerModal({
  isOpen,
  setIsOpen,
  itemSets,
  onConfirm,
}: ItemSetPickerModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    // Default to whichever item set PoB itself has active - that's the
    // single-item-set case's exact prior behavior, just as a preselection
    // instead of a hardcoded choice.
    setSelected(
      new Set(itemSets.filter((set) => set.isActive).map((set) => set.id)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <PickerDialog
      title="Pick item sets"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="max-w-md"
      onConfirm={() => onConfirm([...selected])}
    >
      <>
        <div className="w-full text-left text-sm text-base-content/60">
          Uniques will be pulled from every item set you select below.
        </div>
        <div className="flex w-full flex-col gap-1 rounded-box border border-base-content/20 p-2">
          {itemSets.map((set) => (
            <label
              key={set.id}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-base-100"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={selected.has(set.id)}
                onChange={() => toggle(set.id)}
              />
              <span className="truncate text-left">
                {set.title}
                {set.isActive && (
                  <span className="text-base-content/50"> (active)</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </>
    </PickerDialog>
  );
}
