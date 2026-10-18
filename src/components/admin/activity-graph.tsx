import { toTheme } from "@components/theme-picker";
import { ActivitySession } from "@utils/activity-sessions";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext, useMemo, useRef } from "react";
import { AlignedData } from "uplot";
import UplotReact from "uplot-react";

export function ActivityGraph({
  timestamps,
  sessions,
}: {
  timestamps: number[];
  sessions: ActivitySession[];
}) {
  const { preferences } = useContext(GlobalStateContext);
  const plotRef = useRef<HTMLDivElement>(null);
  const fontColor = toTheme(preferences.theme) === "dark" ? "white" : "black";

  const data: AlignedData = useMemo(
    () => [
      new Float64Array(timestamps.map((t) => t / 1000)),
      new Float64Array(timestamps.map(() => 1)),
    ],
    [timestamps],
  );

  const options: uPlot.Options = useMemo(
    () => ({
      width: 800,
      height: 250,
      legend: { show: false },
      cursor: { drag: { x: true, y: false } },
      axes: [
        { stroke: fontColor, scale: "x" },
        { show: false, scale: "y" },
      ],
      scales: {
        x: { time: true },
        y: { range: [0, 2] },
      },
      series: [
        {},
        {
          label: "Activity",
          scale: "y",
          paths: () => null,
          points: {
            show: true,
            size: 7,
            stroke: "oklch(0.789 0.154 211.53)",
            fill: "oklch(0.789 0.154 211.53)",
          },
        },
      ],
      hooks: {
        // Draws each calculated session as a band: it spans first to last
        // activity point of the session. Zero-length sessions get a hairline.
        draw: [
          (u: uPlot) => {
            const ctx = u.ctx;
            const dpr = window.devicePixelRatio;
            ctx.save();
            ctx.fillStyle = "oklch(0.841 0.238 128.85 / 25%)";
            for (const s of sessions) {
              const x0 = u.valToPos(s.start / 1000, "x", true);
              const x1 = u.valToPos(s.end / 1000, "x", true);
              ctx.fillRect(
                x0,
                u.bbox.top,
                Math.max(x1 - x0, dpr),
                u.bbox.height,
              );
            }
            ctx.restore();
          },
        ],
      },
    }),
    [fontColor, sessions],
  );

  return (
    <div className="w-full rounded-box bg-base-300 p-4" ref={plotRef}>
      <UplotReact
        options={options}
        data={data}
        onCreate={(chart) => {
          chart.setSize({
            width: plotRef.current?.clientWidth
              ? plotRef.current.clientWidth - 32
              : 800,
            height: 250,
          });
        }}
      />
    </div>
  );
}
