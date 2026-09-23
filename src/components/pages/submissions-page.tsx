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
import React, { ReactNode, useContext } from "react";

import { GlobalStateContext } from "@utils/context-provider";

import { Permission, Submission } from "@api";
import {
  useGetRules,
  useGetSubmissions,
  useGetUser,
  useGetUsers,
  useReviewSubmission,
} from "@api";
import VirtualizedTable from "@components/table/virtualized-table";
import { TeamName } from "@components/team/team-name";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@components/table/react-table-shim";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function SubmissionsPage({
  header,
  showAllValues = false,
}: {
  header?: ReactNode;
  showAllValues?: boolean;
}) {
  const { currentEvent } = useContext(GlobalStateContext);
  const qc = useQueryClient();
  const { users, isLoading: usersLoading } = useGetUsers(currentEvent.id);
  const { rules, isLoading: rulesLoading } = useGetRules(currentEvent.id);
  const { user, isLoading: userLoading } = useGetUser();
  const { submissions = [], isLoading: submissionsLoading } = useGetSubmissions(
    currentEvent.id,
  );
  const { reviewSubmission, isPending: reviewPending } = useReviewSubmission(
    qc,
    currentEvent.id,
  );

  const objectiveMap = useSubmissionObjectiveMap(rules);

  const columns = React.useMemo(() => {
    if (!currentEvent || !rules || !users) {
      return [];
    }
    const columns: ColumnDef<Submission>[] = [
      objectiveColumn(objectiveMap, {
        header: "",
        size: 250,
        enableSorting: false,
      }),
      submitterColumn(users, 200),
      {
        header: "",
        accessorKey: "team_id",
        accessorFn: (row) =>
          currentEvent?.teams.find((t) => t.id === row.team_id)?.name,
        cell: (info) => {
          return (
            <TeamName
              team={currentEvent?.teams.find(
                (t) => t.id === info.row.original.team_id,
              )}
            />
          );
        },
        enableSorting: false,
        size: 180,
        filterFn: "includesString",
        meta: {
          filterVariant: "enum",
          filterPlaceholder: "Team",
          options: currentEvent.teams.map((team) => team.name),
        },
      },
      proofColumn(100),
      commentColumn(200),
      valueColumn(100, (info) =>
        showAllValues || info.row.original.number > 1 ? info.getValue() : "",
      ),
      statusColumn(100),
      timestampColumn(170),
    ];
    if (user?.permissions.includes(Permission.submission_judge)) {
      columns.push({
        header: "Actions",
        accessorKey: "id",
        enableSorting: false,
        cell: (info) => {
          const submissionId = info.row.original.id;
          return (
            <div className="flex flex-col gap-1">
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  reviewSubmission(submissionId, {
                    approval_status: "APPROVED",
                  });
                }}
                disabled={reviewPending}
              >
                {reviewPending ? (
                  <span className="loading loading-xs loading-spinner"></span>
                ) : null}
                Approve
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => {
                  reviewSubmission(submissionId, {
                    approval_status: "REJECTED",
                  });
                }}
                disabled={reviewPending}
              >
                {reviewPending ? (
                  <span className="loading loading-xs loading-spinner"></span>
                ) : null}
                Reject
              </button>
            </div>
          );
        },
      });
    }
    return columns;
  }, [
    currentEvent,
    users,
    user,
    objectiveMap,
    reviewSubmission,
    rules,
    reviewPending,
    showAllValues,
  ]);

  // Show loading state while any data is loading
  if (usersLoading || rulesLoading || userLoading || submissionsLoading) {
    return <SubmissionsLoading />;
  }

  if (!currentEvent || !rules) {
    return <div>No event selected</div>;
  }
  return (
    <div className="mt-4 flex flex-col">
      {header}
      <VirtualizedTable<Submission>
        className="mt-4 h-[70vh]"
        data={submissions}
        columns={columns}
        rowClassName={() => "hover:bg-base-200/50"}
      ></VirtualizedTable>
    </div>
  );
}
