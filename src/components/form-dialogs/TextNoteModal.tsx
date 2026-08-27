import { Dialog } from "@components/dialog";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

interface TextNoteModalProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialValue: string;
  maxLength: number;
  onConfirm: (value: string) => void;
}

export function TextNoteModal({
  title,
  isOpen,
  setIsOpen,
  initialValue,
  maxLength,
  onConfirm,
}: TextNoteModalProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const atLimit = value.length >= maxLength;

  return (
    <Dialog
      title={title}
      open={isOpen}
      setOpen={setIsOpen}
      className="max-w-sm"
    >
      <div className="flex w-full flex-col gap-2">
        <textarea
          autoFocus
          className="textarea h-32 w-full"
          value={value}
          maxLength={maxLength}
          onChange={(e) => setValue(e.target.value)}
        />
        <div
          className={twMerge(
            "w-full text-right text-xs text-base-content/50",
            atLimit ? "text-error" : "",
          )}
        >
          {value.length}/{maxLength}
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
              onConfirm(value);
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
