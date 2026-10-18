import { Permission, useGetUsers, useGetUserActivityTimestamps } from "@api";
import { computeSessions } from "@utils/activity-sessions";
import { GlobalStateContext } from "@utils/context-provider";
import { renderConditionally } from "@utils/token";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useContext, useMemo, useState } from "react";
import "uplot/dist/uPlot.min.css";

const ActivityGraph = lazy(() =>
  import("@components/admin/activity-graph").then((m) => ({
    default: m.ActivityGraph,
  })),
);

export const Route = createFileRoute("/admin/activity/$userId")({
  component: renderConditionally(ActivityGraphPage, [Permission.admin]),
});

// Matches the default of the activity endpoints.
const DEFAULT_THRESHOLD_SECONDS = 1800;

function formatHours(ms: number) {
  const totalMinutes = Math.round(ms / 60000);
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m (${(ms / 3_600_000).toFixed(2)} h)`;
}

function ActivityGraphPage() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { users = [] } = useGetUsers(currentEvent.id);
  const { userId: userIdParam } = Route.useParams();
  const navigate = useNavigate();
  const userId = Number(userIdParam) || undefined;
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD_SECONDS);

  const { timestamps: rawTimestamps, isLoading } = useGetUserActivityTimestamps(
    currentEvent.id,
    userId ?? 0,
  );

  const timestamps = useMemo(
    () => rawTimestamps.map((d) => new Date(d).getTime()).sort((a, b) => a - b),
    [rawTimestamps],
  );
  const sessions = useMemo(
    () => computeSessions(timestamps, threshold * 1000),
    [timestamps, threshold],
  );
  const totalMs = sessions.reduce((sum, s) => sum + (s.end - s.start), 0);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-box bg-base-200 p-4">
        <label className="flex items-center gap-4">
          <span className="w-24">Player</span>
          <select
            className="select"
            value={userId ?? ""}
            onChange={(e) =>
              e.target.value &&
              navigate({
                to: "/admin/activity/$userId",
                params: { userId: e.target.value },
              })
            }
          >
            <option value="">Select a player…</option>
            {[...users]
              .sort((a, b) => a.display_name.localeCompare(b.display_name))
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.display_name}
                </option>
              ))}
          </select>
        </label>
        <label className="flex items-center gap-4">
          <span className="w-24">Interval</span>
          <input
            type="range"
            className="range w-full max-w-xl"
            min={30}
            max={7200}
            step={30}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
          <input
            type="number"
            className="input w-28"
            min={1}
            value={threshold}
            onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
          />
          <span>
            s ({(threshold / 60).toFixed(1)} min, default{" "}
            {DEFAULT_THRESHOLD_SECONDS / 60} min)
          </span>
        </label>
        <p className="text-sm opacity-70">
          Consecutive activity points closer than the interval belong to the
          same session. A session counts from its first to its last point, so
          the interval is the largest gap that is bridged, not padding around
          each point.
        </p>
      </div>

      {userId === undefined ? (
        <div>Select a player.</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : timestamps.length === 0 ? (
        <div>No activity recorded for this player.</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-8 rounded-box bg-base-200 p-4">
            <div>
              <div className="text-sm opacity-70">Total active time</div>
              <div className="text-2xl font-bold">{formatHours(totalMs)}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Sessions</div>
              <div className="text-2xl font-bold">{sessions.length}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Activity points</div>
              <div className="text-2xl font-bold">{timestamps.length}</div>
            </div>
          </div>
          <Suspense fallback={<div>Loading chart...</div>}>
            <ActivityGraph timestamps={timestamps} sessions={sessions} />
          </Suspense>
          <div className="text-sm opacity-70">
            Blue dots are recorded activity points, green bands are the sessions
            counted at the current interval. Drag on the chart to zoom,
            double-click to reset.
          </div>
        </>
      )}
    </div>
  );
}
