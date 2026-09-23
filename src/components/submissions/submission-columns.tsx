import { Objective, Submission } from "@api";
import { ColumnDef } from "@components/table/react-table-shim";
import {
  CheckCircleIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { renderStringWithUrl } from "@utils/text-utils";

type SubmissionColumn = ColumnDef<Submission>;

export function objectiveColumn(
  objectiveMap: Record<number, Objective>,
  {
    header,
    size,
    enableSorting,
  }: {
    header: string;
    size: number;
    enableSorting?: boolean;
  },
): SubmissionColumn {
  return {
    header,
    accessorKey: "objective_id",
    accessorFn: (row) => objectiveMap[row.objective_id]?.name,
    cell: (info) => info.getValue(),
    ...(enableSorting !== undefined && { enableSorting }),
    size,
    filterFn: "includesString",
    meta: {
      filterVariant: "enum",
      filterPlaceholder: "Objective",
      options: Object.values(objectiveMap).map((objective) => objective.name),
    },
  };
}

export function submitterColumn(
  users: { id: number; display_name: string }[],
  size: number,
): SubmissionColumn {
  return {
    header: "Submitter",
    accessorKey: "user_id",
    cell: (info) => {
      const user = users.find((u) => u.id === info.row.original.user_id);
      return user ? user.display_name : "Unknown User";
    },
    size,
  };
}

export function proofColumn(size: number): SubmissionColumn {
  return {
    header: "Proof",
    accessorKey: "proof",
    size,
    cell: (info) =>
      info.getValue()
        ? renderStringWithUrl(info.row.original.proof)
        : "No proof provided",
  };
}

export function commentColumn(size: number): SubmissionColumn {
  return {
    header: "Comment",
    accessorKey: "comment",
    size,
    cell: (info) => info.getValue(),
    enableSorting: false,
  };
}

export function valueColumn(
  size: number,
  cell?: SubmissionColumn["cell"],
): SubmissionColumn {
  return {
    header: "Value",
    accessorKey: "number",
    cell: cell ?? ((info) => info.getValue()),
    size,
  };
}

const STATUS_DISPLAY = {
  PENDING: { label: "Pending", tone: "warning", Icon: EyeSlashIcon },
  APPROVED: { label: "Approved", tone: "success", Icon: CheckCircleIcon },
  REJECTED: { label: "Rejected", tone: "error", Icon: XCircleIcon },
} as const;

export function statusColumn(size: number): SubmissionColumn {
  return {
    header: "Status",
    accessorKey: "approval_status",
    size,
    cell: (info) => {
      const status =
        STATUS_DISPLAY[info.getValue() as keyof typeof STATUS_DISPLAY];
      if (!status) return "Unknown";
      const { label, Icon } = status;
      // Full class names so tailwind can see them.
      const text = {
        warning: "text-warning",
        success: "text-success",
        error: "text-error",
      }[status.tone];
      return (
        <div className={`tooltip cursor-help ${text}`} data-tip={label}>
          <Icon className={`size-6 ${text}`} />
        </div>
      );
    },
  };
}

export function timestampColumn(size: number): SubmissionColumn {
  return {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: (info) => new Date(info.row.original.timestamp).toLocaleString(),
    size,
  };
}
