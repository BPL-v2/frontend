import { Event } from "@api";
import { useGetEvents } from "@api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { contrastColor } from "@utils/color";

export const Route = createFileRoute("/events/")({
  component: EventsPage,
});

function EventCard({ event }: { event: Event }) {
  const start = new Date(event.event_start_time);
  const end = new Date(event.event_end_time);
  const hasEnded = end < new Date();

  return (
    <div className="card bg-base-200">
      <div className="card-body p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1">
              <h2 className="card-title text-2xl">
                {event.name.split(" (")[0]}
              </h2>
              <span className="badge badge-secondary">{event.patch}</span>
              {event.is_current && (
                <span className="badge badge-primary">Current</span>
              )}
              {!hasEnded && !event.is_current && (
                <span className="badge badge-secondary">Upcoming</span>
              )}
            </div>
            <div className="text-base-content/70 text-sm">
              {start.toLocaleDateString()} - {end.toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.teams.map((team) => (
              <div
                key={team.id}
                className="badge font-bold"
                style={{
                  backgroundColor: team.color,
                  color: team.color ? contrastColor(team.color) : undefined,
                }}
              >
                {team.name}
              </div>
            ))}
          </div>
          {hasEnded && (
            <Link
              to="/events/$eventId"
              params={{ eventId: String(event.id) }}
              className="btn btn-primary shrink-0"
            >
              View Ladder
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const { events = [] } = useGetEvents();

  const sorted = [...events]
    .filter((e) => e.is_public)
    .sort(
      (a, b) =>
        new Date(b.event_start_time).getTime() -
        new Date(a.event_start_time).getTime(),
    );

  return (
    <div className="mx-auto mt-8 flex flex-col gap-8">
      <div className="card max-w-full bg-base-300">
        <div className="card-body p-12">
          <div className="card-title text-4xl">Events</div>
          <div className="mt-4 flex flex-col gap-4">
            {sorted.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
