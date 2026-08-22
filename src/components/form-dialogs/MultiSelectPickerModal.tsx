import { Dialog } from "@components/dialog";
import { useEffect, useState } from "react";

interface MultiSelectPickerModalProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  options: string[];
  initialSelected: string[];
  onConfirm: (selected: string[]) => void;
}

export function MultiSelectPickerModal({
  title,
  isOpen,
  setIsOpen,
  options,
  initialSelected,
  onConfirm,
}: MultiSelectPickerModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    setSelected(new Set(initialSelected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggle = (option: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  return (
    <Dialog title={title} open={isOpen} setOpen={setIsOpen}>
      <div className="flex w-full flex-col gap-3">
        <div className="flex max-h-[50vh] w-full flex-col gap-1 overflow-y-auto rounded-box border border-base-content/20 p-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-base-100"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={selected.has(option)}
                onChange={() => toggle(option)}
              />
              {option}
            </label>
          ))}
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
