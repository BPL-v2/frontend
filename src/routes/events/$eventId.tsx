import { LadderDisplay } from "@components/ladder-display";
import { Team } from "@api";
import { useGetEvents, useGetRules, useGetScore } from "@api";
import Table from "@components/table/table";
import TeamScoreDisplay from "@components/team/team-score";
import { TeamName } from "@components/team/team-name";
import { ColumnDef } from "@components/table/react-table-shim";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Score } from "@components/score";
import { GlobalStateContext } from "@utils/context-provider";
import { hidePOTotal, mergeScores, getTotalPoints } from "@utils/utils";
import { JSX, useContext, useMemo } from "react";

export const Route = createFileRoute("/events/$eventId")({
  component: EventPage,
});

type RowDef = {
  total: number;
  team: Team;
  key: string;
  [category: string]: number | Team | string;
};

function EventPage(): JSX.Element {
  const { eventId: eventIdParam } = Route.useParams();
  const eventId = Number(eventIdParam);
  const { isMobile } = useContext(GlobalStateContext);

  const { events = [] } = useGetEvents();
  const event = events.find((e) => e.id === eventId);

  const { rules } = useGetRules(eventId);
  const { score: rawScore } = useGetScore(eventId);

  const scores = useMemo(() => {
    if (!rules || !rawScore || !event) return undefined;
    return hidePOTotal(
      mergeScores(
        rules,
        rawScore,
        event.teams.map((t) => t.id),
      ),
    );
  }, [rules, rawScore, event]);

  const categoryNames = scores?.children.map((c) => c.name) || [];
  const scoreRows = (event?.teams || []).map((team) => ({
    team,
    key: team.id.toString(),
    total: getTotalPoints(scores)[team.id] || 0,
    ...Object.fromEntries(
      categoryNames.map((name) => {
        const child = scores?.children.find((c) => c.name === name);
        return [name, child ? getTotalPoints(child)[team.id] || 0 : 0];
      }),
    ),
  })) as RowDef[];

  const scoreColumns: ColumnDef<RowDef>[] = [
    {
      accessorKey: "team.name",
      header: "Team",
      cell: ({ row }) => (
        <TeamName className="font-semibold" team={row.original?.team} />
      ),
      meta: { align: "left" },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <Score
          actualNumberOfPoints={row.original.total}
          potentialNumberOfPoints={undefined}
          usesMedals={event?.uses_medals}
        />
      ),
    },
    ...categoryNames.map((name) => ({
      header: name === "Personal Objectives" ? "P.O." : name,
      accessorKey: name,
      key: `column-${name}`,
      // @ts-ignore: dynamic key access on typed row
      cell: ({ row }) => (
        <Score
          actualNumberOfPoints={(row.original[name] as number) || 0}
          potentialNumberOfPoints={undefined}
          usesMedals={event?.uses_medals}
        />
      ),
    })),
  ];

  if (!event) {
    return (
      <div className="mx-auto mt-8 flex flex-col gap-8">
        <div className="card bg-card">
          <div className="card-body p-12">
            <div className="text-xl opacity-60">Loading event...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 flex flex-col gap-8">
      <div className="card bg-card">
        <div className="card-body p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{event.name}</h1>
              <div className="mt-1 opacity-60">
                {new Date(event.event_start_time).toLocaleDateString()} –{" "}
                {new Date(event.event_end_time).toLocaleDateString()}
              </div>
            </div>
            <Link to="/events" className="btn btn-ghost btn-sm">
              ← All Events
            </Link>
          </div>
        </div>
      </div>

      {isMobile ? (
        <TeamScoreDisplay objective={scores} />
      ) : (
        <>
          <div className="divider divider-primary">Team Scores</div>
          <Table
            data={scoreRows.sort((a, b) => b.total - a.total)}
            columns={scoreColumns}
            className="max-h-[30vh]"
          />
        </>
      )}

      <LadderDisplay event={event} archive />
    </div>
  );
}
