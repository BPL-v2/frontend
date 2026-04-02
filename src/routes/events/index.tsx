import { Event, GameVersion } from "@client/api";
import { useGetEvents } from "@client/query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/events/")({
  component: EventsPage,
});

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0,
    s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h / 6;
  }

  const perceived = 0.299 * r + 0.587 * g + 0.114 * b;
  const newL = perceived > 0.5 ? 0.15 : 0.9;
  const c = (1 - Math.abs(2 * newL - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = newL - c / 2;
  let [r2, g2, b2] = [0, 0, 0];
  const hi = Math.floor(h * 6);
  if (hi === 0) [r2, g2, b2] = [c, x, 0];
  else if (hi === 1) [r2, g2, b2] = [x, c, 0];
  else if (hi === 2) [r2, g2, b2] = [0, c, x];
  else if (hi === 3) [r2, g2, b2] = [0, x, c];
  else if (hi === 4) [r2, g2, b2] = [x, 0, c];
  else [r2, g2, b2] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

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
      (a, b) => Date.parse(b.event_start_time) - Date.parse(a.event_start_time),
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
