import { Permission, RecurringJob } from "@api";
import { useGetEvents, useGetJobs, useStartJob } from "@api";
import { RecurringJobFormModal } from "@components/form-dialogs/RecurringJobFormModal";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { renderConditionally } from "@utils/token";
import React from "react";

export const Route = createFileRoute("/admin/recurring-jobs")({
  component: renderConditionally(RecurringJobsPage, [Permission.admin]),
});

function RecurringJobsPage() {
  const queryClient = useQueryClient();
  const { events, isLoading: eventsLoading } = useGetEvents();
  const { jobs = [], isLoading: jobsLoading } = useGetJobs();
  const { startJob, isPending: startJobPending } = useStartJob(queryClient);
  const [showModal, setShowModal] = React.useState(false);

  const stopJob = (job: RecurringJob) => {
    startJob({
      event_id: job.event_id,
      job_type: job.job_type,
      end_date: new Date(),
    });
  };

  if (eventsLoading || jobsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-lg loading-spinner" />
          <p className="text-lg">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (!events) {
    return <div>Loading events...</div>;
  }

  return (
    <>
      <RecurringJobFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        events={events}
      />
      <table className="table mt-4 w-full">
        <thead className="bg-base-200">
          <tr>
            <th>Job Type</th>
            <th>Event</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-base-300">
          {jobs.map((job, id) => (
            <tr key={id}>
              <td>{job.job_type}</td>
              <td>{events.find((event) => event.id === job.event_id)?.name}</td>
              <td>{new Date(job.end_date).toLocaleString()}</td>
              <td>
                {new Date(job.end_date) < new Date() ? "Stopped" : "Running"}
              </td>
              <td className="flex gap-2">
                {new Date(job.end_date) < new Date() ? null : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => stopJob(job)}
                    disabled={startJobPending}
                  >
                    {startJobPending && (
                      <span className="loading loading-xs loading-spinner" />
                    )}
                    Stop
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn mt-4 btn-primary"
        onClick={() => setShowModal(true)}
      >
        Add Job
      </button>
    </>
  );
}

export default RecurringJobsPage;
