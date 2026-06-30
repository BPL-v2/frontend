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
      <div className="card-body p-8">
        <div className="flex h-full items-start justify-between gap-1">
          <div className="flex h-full w-full flex-col items-start gap-2">
            <div className="items-top flex h-full gap-1">
              <h2 className="mr-1 card-title text-2xl">
                {event.name.split(" (")[0]}
              </h2>
              <span className="m-1 badge badge-secondary">{event.patch}</span>
              {event.is_current && (
                <span className="m-1 badge badge-primary">Current</span>
              )}
              {!hasEnded && !event.is_current && (
                <span className="m-1 badge badge-secondary">Upcoming</span>
              )}
            </div>
            <div className="text-base-content/70">
              {start.toLocaleDateString()} - {end.toLocaleDateString()}
            </div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="flex w-full flex-col gap-2">
            <h2 className="text-lg font-bold">Teams</h2>
            <div className="flex w-full flex-row items-start justify-items-start gap-2">
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
            </div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="flex flex-col gap-2 self-center">
            {hasEnded && (
              <Link
                to="/events/$eventId"
                params={{ eventId: String(event.id) }}
                className="btn btn-primary"
              >
                View Ladder
              </Link>
            )}
          </div>
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
