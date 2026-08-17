import { Team } from "@api";
import { useGetEventStatus, useGetSubmissions } from "@api";
import { useGetUsers } from "@api";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ScoreObjective } from "@mytypes/score";
import { ColumnDef } from "./react-table-shim";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext, useMemo, useState } from "react";
import { TeamName } from "@components/team/team-name";
import { SubmissionFormModal } from "@components/form-dialogs/SubmissionFormModal";
import {
  SubmissionStatus,
  VideoButton,
} from "@components/cards/submission-card";
import VirtualizedTable from "./virtualized-table";

export type SubmissionTableProps = {
  objective: ScoreObjective;
  filter?: (obj: ScoreObjective) => boolean;
  className?: string;
  styles?: {
    header?: string;
    body?: string;
    table?: string;
  };
};

export function SubmissionTable({
  objective,
  filter,
  className,
  styles,
}: SubmissionTableProps) {
  const { currentEvent, preferences } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { submissions = [] } = useGetSubmissions(currentEvent.id);
  const { users } = useGetUsers(currentEvent.id);
  const [activeObjective, setActiveObjective] = useState<ScoreObjective>();
  const [showModal, setShowModal] = useState(false);

  const userMap =
    users?.reduce((acc: { [userId: number]: string }, user) => {
      acc[user.id] = user.display_name;
      return acc;
    }, {}) || {};

  const canSubmit =
    !!eventStatus?.team_id &&
    new Date(currentEvent.event_start_time) < new Date() &&
    new Date(currentEvent.event_end_time) > new Date();

  const teamIds = currentEvent.teams
    .sort((a, b) => {
      if (a.id === eventStatus?.team_id) return -1;
      if (b.id === eventStatus?.team_id) return 1;
      return (
        objective.team_score[b.id].totalPoints() -
        objective.team_score[a.id].totalPoints()
      );
    })
    .slice(0, preferences.limitTeams ? preferences.limitTeams : undefined)
    .map((team) => team.id);

  const columns = useMemo<ColumnDef<ScoreObjective>[]>(() => {
    const teams = currentEvent.teams
      .filter((team) => teamIds.includes(team.id))
      .sort((a: Team, b: Team) => {
        if (a.id === eventStatus?.team_id) return -1;
        if (b.id === eventStatus?.team_id) return 1;
        return a.name.localeCompare(b.name);
      });
    return [
      {
        accessorKey: "name",
        header: "",
        enableSorting: false,
        size: 300,
        cell: (info) => info.row.original.name,
        filterFn: "includesString",
        meta: {
          filterVariant: "string",
          filterPlaceholder: "Name",
        },
      },
      ...teams.map(
        (team) =>
          ({
            accessorFn: (row: ScoreObjective) =>
              row.team_score[team.id].isFinished(),
            id: `team_${team.id}`,
            header: () => <TeamName team={team} />,
            enableSorting: false,
            size: 220,
            meta: { align: "center", filterVariant: "boolean" },
            cell: (info) => {
              const obj = info.row.original;
              const teamSubmissions = submissions.filter(
                (submission) =>
                  submission.team_id === team.id &&
                  submission.objective_id === obj.id,
              );
              return (
                <div className="flex items-center justify-center gap-4">
                  <VideoButton submissions={teamSubmissions} />
                  <SubmissionStatus
                    submissions={teamSubmissions}
                    userMap={userMap}
                  />
                  {canSubmit && team.id === eventStatus?.team_id && (
                    <div
                      className="tooltip tooltip-left lg:tooltip-top"
                      data-tip="Submit"
                    >
                      <button
                        className="rounded-full"
                        onClick={() => {
                          setActiveObjective(obj);
                          setShowModal(true);
                        }}
                      >
                        <PlusCircleIcon className="size-6 cursor-pointer" />
                      </button>
                    </div>
                  )}
                </div>
              );
            },
          }) as ColumnDef<ScoreObjective>,
      ),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent, teamIds, submissions, userMap, canSubmit, eventStatus]);

  if (!currentEvent || !objective) {
    return <></>;
  }

  return (
    <>
      <SubmissionFormModal
        objective={activeObjective}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <VirtualizedTable
        columns={columns}
        data={objective.children
          .filter(
            (obj) => !obj.valid_from || obj.valid_from.getTime() <= Date.now(),
          )
          .filter((obj) => (filter ? filter(obj) : true))
          .sort((a, b) => a.name.localeCompare(b.name))}
        rowClassName={() => "bg-base-300 hover:bg-base-200"}
        className={className ? className : "max-h-[70vh] w-full"}
        styles={styles}
      />
    </>
  );
}
