import { useEffect } from "react";
import { Event, EventCreate, GameVersion } from "@client/api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateEvent } from "@client/query";

interface EventFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  existingEvent?: Event | null;
}

export function EventFormModal({
  isOpen,
  setIsOpen,
  existingEvent,
}: EventFormModalProps) {
  const qc = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      patch: "",
      game_version: GameVersion.poe1,
      application_start_time: new Date().toISOString(),
      application_end_time: new Date().toISOString(),
      event_start_time: new Date().toISOString(),
      event_end_time: new Date().toISOString(),
      max_size: 1000,
      waitlist_size: 100,
      is_current: false,
      is_public: false,
      is_locked: false,
    } as EventCreate,
    onSubmit: (data) => createEvent(data.value),
  });

  const { createEvent } = useCreateEvent(qc, () => {
    setIsOpen(false);
    form.reset();
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    if (existingEvent) {
      setFormValues(form, existingEvent);
    }
  }, [isOpen, existingEvent]);

  return (
    <Dialog
      setOpen={setIsOpen}
      open={isOpen}
      title={existingEvent ? "Edit Event" : "Create Event"}
      className="max-w-xl"
    >
      <form
        className="flex w-full flex-col gap-2 rounded-box bg-base-300 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-row gap-4">
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" />}
          />
          <form.AppField
            name="game_version"
            children={(field) => (
              <field.SelectField
                label="Game Version"
                options={Object.values(GameVersion)}
              />
            )}
          />
          <form.AppField
            name="patch"
            children={(field) => <field.TextField label="Patch" />}
          />
        </div>
        <div className="flex flex-row gap-4">
          <form.AppField
            name="application_start_time"
            children={(field) => (
              <field.DateTimeField label="Application Start Time" />
            )}
          />
          <form.AppField
            name="application_end_time"
            children={(field) => (
              <field.DateTimeField label="Application End Time" />
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <form.AppField
            name="event_start_time"
            children={(field) => (
              <field.DateTimeField label="Event Start Time" />
            )}
          />
          <form.AppField
            name="event_end_time"
            children={(field) => (
              <field.DateTimeField label="Event End Time" />
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <form.AppField
            name="max_size"
            children={(field) => <field.NumberField label="Max Size" />}
          />
          <form.AppField
            name="waitlist_size"
            children={(field) => <field.NumberField label="Waitlist Size" />}
          />
        </div>
        <div className="flex flex-row justify-between">
          <form.AppField
            name="is_current"
            children={(field) => <field.BooleanField label="Is Current" />}
          />
          <form.AppField
            name="is_public"
            children={(field) => <field.BooleanField label="Is Public" />}
          />
          <form.AppField
            name="is_locked"
            children={(field) => <field.BooleanField label="Is Locked" />}
          />
        </div>
        <div className="mt-4 flex flex-row justify-end gap-4">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}
