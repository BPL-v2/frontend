import { GlobalStateContext } from "@utils/context-provider";
import { getTotalPoints } from "@utils/utils";
import { useContext } from "react";
import Table from "./table/table";
import TeamScoreDisplay from "./team/team-score";
import { Score } from "./score";
import { TeamName } from "./team/team-name";
import { Team } from "@api/generated/models/team";
import { ColumnDef } from "./table/react-table-shim";

type RowDef = {
  total: number;
  team: Team;
  key: string;
  "Personal Objectives": number;
  Collections: number;
  Uniques: number;
  Bounties: number;
  Races: number;
  Dailies: number;
};

export function TeamScoreTable() {
  const { scores, currentEvent, isMobile } = useContext(GlobalStateContext);
  const categoryNames = scores?.children.map((category) => category.name) || [];
  const rows = currentEvent.teams.map((team) => {
    return {
      team: team,
      key: team?.id?.toString(),
      total: getTotalPoints(scores)[team.id] || 0,
      ...Object.fromEntries(
        categoryNames.map((categoryName) => {
          const child = scores?.children.find(
            (category) => category.name === categoryName,
          );
          if (!child) {
            return [categoryName, 0];
          }
          return [categoryName, getTotalPoints(child)[team.id] || 0];
        }),
      ),
    } as RowDef;
  });
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
      cell: ({ row }) => {
        const teamColor = row.original.team.color;
        const color = teamColor
          ? `color-mix(in srgb, ${teamColor} 25%, light-dark(black, white))`
          : undefined;
        return (
          <span className="text-lg font-bold" style={{ color }}>
            <Score
              actualNumberOfPoints={row.original.total}
              potentialNumberOfPoints={undefined}
              usesMedals={currentEvent?.uses_medals}
            />
          </span>
        );
      },
      meta: {},
    },
    ...categoryNames.map((categoryName) => ({
      header: categoryName == "Personal Objectives" ? "P.O." : categoryName,
      accessorKey: categoryName,
      key: `column-${categoryName}`,
      // @ts-ignore: dynamic key access on typed row
      cell: ({ row }) => (
        <Score
          actualNumberOfPoints={row.original[categoryName as keyof RowDef] || 0}
          potentialNumberOfPoints={undefined}
          usesMedals={currentEvent?.uses_medals}
        />
      ),
      // @ts-ignore: dynamic key access on typed row
      sorter: (a, b) => a[categoryName] - b[categoryName],
    })),
  ];
  return isMobile ? (
    <TeamScoreDisplay objective={scores} />
  ) : (
    <>
      <div className="divider divider-primary">Team Scores</div>
      <Table
        data={rows.sort((a, b) => b.total - a.total)}
        columns={scoreColumns}
        className="max-h-[35vh]"
      ></Table>
    </>
  );
}
