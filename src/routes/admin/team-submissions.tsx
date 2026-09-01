import { createFileRoute } from "@tanstack/react-router";
import React, { useContext, useMemo } from "react";

import { GlobalStateContext } from "@utils/context-provider";

import { Objective, ObjectiveType, Submission } from "@api";
import {
  useGetEventStatus,
  useGetRules,
  useGetSubmissions,
  useGetUsers,
} from "@api";
import VirtualizedTable from "@components/table/virtualized-table";
import {
  CheckCircleIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ColumnDef } from "@components/table/react-table-shim";
import { renderStringWithUrl } from "@utils/text-utils";
import { iterateObjectives } from "@utils/utils";

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

  const objectiveMap: Record<number, Objective> = useMemo(() => {
    const map: Record<number, Objective> = {};
    iterateObjectives(rules, (objective) => {
      if (objective.objective_type === ObjectiveType.SUBMISSION) {
        map[objective.id] = objective;
      }
    });
    return map;
  }, [rules]);

  const teamSubmissions = useMemo(
    () => submissions.filter((s) => s.team_id === eventStatus?.team_id),
    [submissions, eventStatus?.team_id],
  );

  const columns = React.useMemo(() => {
    if (!currentEvent || !rules || !users) {
      return [];
    }
    const columns: ColumnDef<Submission>[] = [
      {
        header: "Objective",
        accessorKey: "objective_id",
        accessorFn: (row) => objectiveMap[row.objective_id]?.name,
        cell: (info) => info.getValue(),
        size: 380,
        filterFn: "includesString",
        meta: {
          filterVariant: "enum",
          filterPlaceholder: "Objective",
          options: Object.values(objectiveMap).map(
            (objective) => objective.name,
          ),
        },
      },
      {
        header: "Submitter",
        accessorKey: "user_id",
        cell: (info) => {
          const user = users.find((u) => u.id === info.row.original.user_id);
          return user ? user.display_name : "Unknown User";
        },
        size: 220,
      },
      {
        header: "Proof",
        accessorKey: "proof",
        size: 250,
        cell: (info) => {
          const proof = info.getValue();
          if (!proof) {
            return "No proof provided";
          }
          return renderStringWithUrl(info.row.original.proof);
        },
      },
      {
        header: "Comment",
        accessorKey: "comment",
        size: 320,
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        header: "Value",
        accessorKey: "number",
        cell: (info) => info.getValue(),
        size: 120,
      },
      {
        header: "Status",
        accessorKey: "approval_status",
        size: 120,
        cell: (info) => {
          switch (info.getValue()) {
            case "PENDING":
              return (
                <div
                  className="tooltip cursor-help text-warning"
                  data-tip="Pending"
                >
                  <EyeSlashIcon className="size-6 text-warning" />
                </div>
              );
            case "APPROVED":
              return (
                <div
                  className="tooltip cursor-help text-success"
                  data-tip="Approved"
                >
                  <CheckCircleIcon className="size-6 text-success" />
                </div>
              );
            case "REJECTED":
              return (
                <div
                  className="tooltip cursor-help text-error"
                  data-tip="Rejected"
                >
                  <XCircleIcon className="size-6 text-error" />
                </div>
              );
            default:
              return "Unknown";
          }
        },
      },
      {
        header: "Timestamp",
        accessorKey: "timestamp",
        cell: (info) => new Date(info.row.original.timestamp).toLocaleString(),
        size: 200,
      },
    ];
    return columns;
  }, [currentEvent, users, objectiveMap, rules]);

  if (usersLoading || rulesLoading || submissionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-lg loading-spinner"></span>
          <p className="text-lg">Loading submissions...</p>
        </div>
      </div>
    );
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
