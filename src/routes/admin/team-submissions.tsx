import {
  SubmissionsLoading,
  useSubmissionObjectiveMap,
} from "@components/submissions/submission-hooks";
import {
  commentColumn,
  objectiveColumn,
  proofColumn,
  statusColumn,
  submitterColumn,
  timestampColumn,
  valueColumn,
} from "@components/submissions/submission-columns";
import { createFileRoute } from "@tanstack/react-router";
import React, { useContext, useMemo } from "react";

import { GlobalStateContext } from "@utils/context-provider";

import { Submission } from "@api";
import {
  useGetEventStatus,
  useGetRules,
  useGetSubmissions,
  useGetUsers,
} from "@api";
import VirtualizedTable from "@components/table/virtualized-table";
import { ColumnDef } from "@components/table/react-table-shim";

export const Route = createFileRoute("/admin/team-submissions")({
  component: TeamSubmissionsPage,
});

function TeamSubmissionsPage() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const { users, isLoading: usersLoading } = useGetUsers(currentEvent.id);
  const { rules, isLoading: rulesLoading } = useGetRules(currentEvent.id);
  const { submissions = [], isLoading: submissionsLoading } = useGetSubmissions(
    currentEvent.id,
  );

  const objectiveMap = useSubmissionObjectiveMap(rules);

  const teamSubmissions = useMemo(
    () => submissions.filter((s) => s.team_id === eventStatus?.team_id),
    [submissions, eventStatus?.team_id],
  );

  const columns = React.useMemo(() => {
    if (!currentEvent || !rules || !users) {
      return [];
    }
    const columns: ColumnDef<Submission>[] = [
      objectiveColumn(objectiveMap, { header: "Objective", size: 380 }),
      submitterColumn(users, 220),
      proofColumn(250),
      commentColumn(320),
      valueColumn(120),
      statusColumn(120),
      timestampColumn(200),
    ];
    return columns;
  }, [currentEvent, users, objectiveMap, rules]);

  if (usersLoading || rulesLoading || submissionsLoading) {
    return <SubmissionsLoading />;
  }

  if (!eventStatus || !eventStatus.is_team_lead) {
    return <div className="p-4">You must be a team lead to view this.</div>;
  }

  return (
    <div className="mt-4 flex flex-col">
      <VirtualizedTable<Submission>
        className="mt-4 h-[70vh]"
        data={teamSubmissions}
        columns={columns}
        rowClassName={() => "hover:bg-base-200/50"}
      ></VirtualizedTable>
    </div>
  );
}
