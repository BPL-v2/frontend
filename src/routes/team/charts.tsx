import { GameVersion, useGetEventStatus, useGetTeamSheet } from "@api";
import { PieChart, PieSlice } from "@components/charts/pie-chart";
import { GlobalStateContext } from "@utils/context-provider";
import { tallyByPlayer } from "@utils/chart-tally";
import {
  ascendancies,
  UNDECIDED_ASCENDANCY_COLOR,
} from "@mytypes/ascendancy_DeKa";
import { ROLE_COLORS, SPECIALIZATION_COLORS } from "@mytypes/roles";
import { ALTAR_COLORS } from "@mytypes/altars";
import { createFileRoute } from "@tanstack/react-router";
import { useContext, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/team/charts")({
  component: RouteComponent,
});

type ChartTab =
  | "mainRole"
  | "mainSpecialization"
  | "secondRole"
  | "secondSpecialization"
  | "ascendancy"
  | "altars";

const tabs: { key: ChartTab; name: string }[] = [
  { key: "mainRole", name: "Main Role" },
  { key: "mainSpecialization", name: "Main Role Specialization" },
  { key: "secondRole", name: "2nd Role" },
  { key: "secondSpecialization", name: "2nd Role Specialization" },
  { key: "ascendancy", name: "Ascendancy Distribution" },
  { key: "altars", name: "Altars" },
];

function RouteComponent() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { teamSheet = [] } = useGetTeamSheet(
    currentEvent.id,
    eventStatus?.team_id,
  );
  const [tab, setTab] = useState<ChartTab>("mainRole");

  const data = useMemo<PieSlice[]>(() => {
    switch (tab) {
      case "mainRole":
        return tallyByPlayer(
          teamSheet.map((e) => ({
            value: e.role,
            player: e.user.display_name,
          })),
        ).map((slice) => ({
          ...slice,
          color: ROLE_COLORS[slice.label],
        }));
      case "mainSpecialization":
        return tallyByPlayer(
          teamSheet
            .filter((e) => e.specialization)
            .map((e) => ({
              value: `${e.role}: ${e.specialization}`,
              player: e.user.display_name,
            })),
        ).map((slice) => {
          const [role, spec] = slice.label.split(": ");
          return {
            ...slice,
            color: SPECIALIZATION_COLORS[role]?.[spec],
          };
        });
      case "secondRole":
        return tallyByPlayer(
          teamSheet.flatMap((e) =>
            (e.secondary_role ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((value) => ({ value, player: e.user.display_name })),
          ),
        ).map((slice) => ({
          ...slice,
          color: ROLE_COLORS[slice.label],
        }));
      case "secondSpecialization":
        return tallyByPlayer(
          teamSheet.flatMap((e) =>
            (e.secondary_specialization ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((value) => ({ value, player: e.user.display_name })),
          ),
        ).map((slice) => {
          const [role, spec] = slice.label.split(": ");
          return {
            ...slice,
            color: SPECIALIZATION_COLORS[role]?.[spec],
          };
        });
      case "ascendancy":
        return tallyByPlayer(
          teamSheet.map((e) => ({
            value: e.ascendancy || "Undecided",
            player: e.user.display_name,
          })),
        ).map((slice) => ({
          ...slice,
          color:
            slice.label === "Undecided"
              ? UNDECIDED_ASCENDANCY_COLOR
              : ascendancies[GameVersion.poe1][slice.label]?.classColor,
        }));
      case "altars":
        return tallyByPlayer(
          teamSheet
            .filter((e) => e.altars !== "N/A")
            .map((e) => ({
              value: e.altars,
              player: e.user.display_name,
            })),
        ).map((slice) => ({
          ...slice,
          color: ALTAR_COLORS[slice.label],
        }));
    }
  }, [tab, teamSheet]);

  if (!eventStatus?.team_id) {
    return <div className="p-4">You need to be on a team to see this.</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={twMerge(
              "btn btn-sm",
              tab === t.key
                ? "btn-primary"
                : "border-primary bg-base-100/0 text-primary",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="rounded-box bg-base-300 p-6">
        <div className="mb-4 text-lg font-semibold">
          {tabs.find((t) => t.key === tab)?.name}
        </div>
        <PieChart key={tab} data={data ?? []} />
      </div>
    </div>
  );
}
