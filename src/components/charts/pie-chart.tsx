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
  // Explicit hex fill, e.g. to reuse the same colors as the corresponding
  // Select field elsewhere. Falls back to the default rotating palette.
  color?: string;
};

const CENTER = 50;
const OUTER_RADIUS = 48;
const INNER_RADIUS = 28;

function polarToCartesian(radius: number, angleRad: number) {
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

function donutSlicePath(startAngle: number, endAngle: number): string {
  const startOuter = polarToCartesian(OUTER_RADIUS, startAngle);
  const endOuter = polarToCartesian(OUTER_RADIUS, endAngle);
  const startInner = polarToCartesian(INNER_RADIUS, startAngle);
  const endInner = polarToCartesian(INNER_RADIUS, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

type PieChartProps = {
  data: PieSlice[];
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

  let cumulativeAngle = -Math.PI / 2;

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
          {sorted.map((slice, i) => {
            // Clamp so a single 100%-of-total slice doesn't degenerate into
            // a zero-length arc back to its own start point.
            const fraction = Math.min(slice.value / total, 0.9999);
            const startAngle = cumulativeAngle;
            const endAngle = startAngle + fraction * 2 * Math.PI;
            cumulativeAngle = endAngle;
            const isActive = active === slice.label;
            return (
              <path
                key={slice.label}
                d={donutSlicePath(startAngle, endAngle)}
                fill={slice.color ?? COLORS[i % COLORS.length]}
                opacity={active && !isActive ? 0.4 : 1}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHovered(slice.label)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggleSelection(slice.label)}
              />
            );
          })}
        </svg>
        <div
          className={twMerge(
            "md:ml-8",
            sorted.length > 8 ? "columns-2 gap-x-6" : "flex flex-col",
          )}
        >
          {sorted.map((slice, i) => (
            <div
              key={slice.label}
              className={twMerge(
                "mb-1 flex cursor-pointer break-inside-avoid items-center gap-2 rounded px-1 text-sm",
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
                style={{
                  backgroundColor: slice.color ?? COLORS[i % COLORS.length],
                }}
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
            Filtering table by <span className="font-semibold">{pinned}</span> —
            click the slice again to clear.
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
              Hover a slice or legend entry to see who picked it, click to pin
              it.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
