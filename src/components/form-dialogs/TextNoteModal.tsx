import { PickerDialog } from "@components/form-dialogs/PickerDialog";
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
    <PickerDialog
      title={title}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="max-w-sm"
      onConfirm={() => onConfirm(value)}
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
      </div>
    </PickerDialog>
  );
}
