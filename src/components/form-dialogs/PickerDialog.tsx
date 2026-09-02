import { Dialog } from "@components/dialog";
import { ReactNode } from "react";

interface PickerDialogProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  onConfirm: () => void;
  children: ReactNode;
}

// Shared Dialog + Cancel/Confirm footer for the team sheet's small
// picker/note modals - callers still own their own isOpen guard (before any
// expensive body computation) and their own reset-on-open effect; this only
// centralizes the markup that was otherwise hand-copied in every one of
// them.
export function PickerDialog({
  title,
  isOpen,
  setIsOpen,
  className,
  onConfirm,
  children,
}: PickerDialogProps) {
  return (
    <Dialog
      title={title}
      open={isOpen}
      setOpen={setIsOpen}
      className={className}
    >
      <div className="flex w-full flex-col gap-3">
        {children}
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
              onConfirm();
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
