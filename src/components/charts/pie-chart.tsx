import { useState } from "react";
import { twMerge } from "tailwind-merge";

const COLORS = [
  "#4285F4",
  "#EA4335",
  "#FBBC04",
  "#34A853",
  "#FF6D01",
  "#46BDC6",
  "#7B61FF",
  "#F542A7",
  "#00ACC1",
  "#9E9D24",
  "#8E24AA",
  "#3949AB",
  "#00897B",
  "#C0CA33",
  "#F4511E",
  "#6D4C41",
  "#546E7A",
  "#D81B60",
  "#1E88E5",
  "#43A047",
];

export type PieSlice = {
  label: string;
  value: number;
  players: string[];
};

type PieChartProps = {
  data: PieSlice[];
  // Controlled selection mode: when provided, clicking a slice/legend entry
  // calls onSelect instead of showing a "who picked it" list internally.
  // Used e.g. to drive a table filter from the chart.
  selected?: string | null;
  onSelect?: (label: string | null) => void;
};

export function PieChart({ data, selected, onSelect }: PieChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [internalPinned, setInternalPinned] = useState<string | null>(null);
  const isControlled = onSelect !== undefined;
  const pinned = isControlled ? (selected ?? null) : internalPinned;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return <div className="text-base-content/60">No data yet.</div>;
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const active = pinned ?? hovered;
  const activeSlice = sorted.find((s) => s.label === active);

  const toggleSelection = (label: string) => {
    const next = pinned === label ? null : label;
    if (isControlled) {
      onSelect!(next);
    } else {
      setInternalPinned(next);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-center">
        <svg viewBox="0 0 100 100" className="w-64 shrink-0 md:w-80">
          <g transform="rotate(-90 50 50)">
            {sorted.map((slice, i) => {
              const fraction = slice.value / total;
              const dash = fraction * circumference;
              const dashArray = `${dash} ${circumference - dash}`;
              const offset = -cumulative;
              cumulative += dash;
              const isActive = active === slice.label;
              return (
                <circle
                  key={slice.label}
                  r={radius}
                  cx="50"
                  cy="50"
                  fill="none"
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={isActive ? "24" : "20"}
                  strokeDasharray={dashArray}
                  strokeDashoffset={offset}
                  opacity={active && !isActive ? 0.4 : 1}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHovered(slice.label)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => toggleSelection(slice.label)}
                />
              );
            })}
          </g>
        </svg>
        <div className="flex flex-col gap-1 md:ml-8">
          {sorted.map((slice, i) => (
            <div
              key={slice.label}
              className={twMerge(
                "flex cursor-pointer items-center gap-2 rounded px-1 text-sm",
                pinned === slice.label
                  ? "bg-primary/20 ring-1 ring-primary"
                  : hovered === slice.label
                    ? "bg-base-100"
                    : "",
              )}
              onMouseEnter={() => setHovered(slice.label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => toggleSelection(slice.label)}
            >
              <span
                className="size-3 shrink-0 rounded-sm"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="font-medium">{slice.label}</span>
              <span className="text-base-content/60">
                {slice.value} ({((slice.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
      {isControlled ? (
        pinned && (
          <div className="min-h-8 rounded-box bg-base-100 p-3 text-sm">
            Filtering table by{" "}
            <span className="font-semibold">{pinned}</span> — click the slice
            again to clear.
          </div>
        )
      ) : (
        <div className="min-h-8 rounded-box bg-base-100 p-3 text-sm">
          {activeSlice ? (
            <>
              <span className="font-semibold">{activeSlice.label}:</span>{" "}
              {activeSlice.players.join(", ")}
              {pinned === activeSlice.label && (
                <span className="ml-2 text-base-content/60">
                  (pinned — click again to unpin)
                </span>
              )}
            </>
          ) : (
            <span className="text-base-content/60">
              Hover a slice or legend entry to see who picked it, click to
              pin it.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
