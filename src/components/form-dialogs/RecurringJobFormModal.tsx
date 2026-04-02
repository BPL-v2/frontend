import React, { useEffect, useRef } from "react";
import { Event, JobType } from "@client/api";
import { Dialog } from "@components/dialog";
import Select from "@components/form/select";
import { useQueryClient } from "@tanstack/react-query";
import { useStartJob } from "@client/query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const formatDateForInput = (date: Date | null) => {
  if (!date) return "";
  const tzOffset = 2 * date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

interface RecurringJobFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  events: Event[];
}

export function RecurringJobFormModal({
  isOpen,
  setIsOpen,
  events,
}: RecurringJobFormModalProps) {
  const qc = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(null);
  const { startJob, isPending: startJobPending } = useStartJob(qc);

  useEffect(() => {
    if (selectedEvent) {
      setSelectedEndDate(
        dayjs(selectedEvent.event_end_time, "YYYY-MM-DDTHH:mm:ss").toDate(),
      );
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedEvent(null);
      setSelectedEndDate(null);
    }
  }, [isOpen]);

  return (
    <Dialog
      title="Create recurring job"
      open={isOpen}
      setOpen={setIsOpen}
    >
      <form
        className="w-full space-y-4 text-left"
        onSubmit={(e) => {
          const values = new FormData(formRef.current!);
          e.preventDefault();
          startJob({
            eventId: Number(values.get("event")),
            jobType: values.get("jobType") as JobType,
            endDate: new Date(values.get("endDate") as string),
          });
          setIsOpen(false);
          formRef.current?.reset();
        }}
        ref={formRef}
      >
        <fieldset className="fieldset rounded-box bg-base-300 p-4">
          <label className="label">Event</label>
          <Select
            name="event"
            required
            onChange={(value) => {
              setSelectedEvent(
                events.find((event) => event.id === (value || 0)) || null,
              );
            }}
            className="w-full"
            placeholder="Pick an event"
            options={events.map((event) => ({
              label: event.name,
              value: event.id,
            }))}
          />
          <label className="label">Job Type</label>
          <Select
            name="jobType"
            placeholder="Pick a job type"
            className="w-full"
            required
            options={Object.values(JobType)}
          />
          <label className="label">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            className="input w-full"
            defaultValue={formatDateForInput(selectedEndDate)}
            required
          />
        </fieldset>
      </form>
      <div className="modal-action">
        <button
          className="btn btn-soft"
          type="button"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => formRef.current?.requestSubmit()}
          disabled={startJobPending}
        >
          {startJobPending && (
            <span className="loading loading-sm loading-spinner" />
          )}
          Submit
        </button>
      </div>
    </Dialog>
  );
}
