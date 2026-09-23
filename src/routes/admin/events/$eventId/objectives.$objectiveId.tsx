import {
  conditionsColumn,
  objectiveDetailColumns,
  objectiveIconColumn,
  scoringRuleColumn,
} from "@components/objectives/objective-columns";
import { OBJECTIVE_MANAGER_PERMISSIONS } from "@utils/admin-event-route";
import { createFileRoute, Link } from "@tanstack/react-router";
import { JSX, useMemo, useState } from "react";

import {
  Objective,
  ObjectiveType,
  ObjectiveValidation,
  useDuplicateObjective,
} from "@api";
import { useParams } from "@tanstack/react-router";

import {
  useCreateObjective,
  useDeleteObjective,
  useGetEvents,
  useGetObjectiveValidations,
  useGetRules,
  useGetScoringRulesForEvent,
} from "@api";
import VirtualizedTable from "@components/table/virtualized-table";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  FolderOpenIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@components/table/react-table-shim";
import { renderConditionally } from "@utils/token";
import { findObjective, getPath } from "@utils/utils";
import { twMerge } from "tailwind-merge";
import { validateObjectivesBase } from "@api";
import { ObjectiveFormModal } from "@components/form-dialogs/ObjectiveFormModal";
import { BulkObjectiveFormModal } from "@components/form-dialogs/BulkObjectiveFormModal";
import { CategoryFormModal } from "@components/form-dialogs/CategoryFormModal";
import { ConditionFormModal } from "@components/form-dialogs/ConditionFormModal";
import { ReleaseDatesFormModal } from "@components/form-dialogs/ReleaseDatesFormModal";

export const Route = createFileRoute(
  "/admin/events/$eventId/objectives/$objectiveId",
)({
  component: renderConditionally(
    ScoringCategoryPage,
    OBJECTIVE_MANAGER_PERMISSIONS,
  ),
  params: {
    parse: (params) => ({
      objectiveId: Number(params.objectiveId),
    }),
    stringify: (params) => ({
      objectiveId: params.objectiveId.toString(),
    }),
  },
});

function areAllChildrenValidated(
  objective: Objective,
  validationMap: Record<number, ObjectiveValidation>,
): boolean {
  if (objective.children.length === 0) {
    if (objective.objective_type !== ObjectiveType.ITEM) return true;
    return !!validationMap[objective.id];
  }
  return objective.children.every((child) =>
    areAllChildrenValidated(child, validationMap),
  );
}

function ScoringCategoryPage(): JSX.Element {
  const qc = useQueryClient();
  const { eventId, objectiveId } = useParams({ from: Route.id });
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBulkObjectiveModalOpen, setIsBulkObjectiveModalOpen] =
    useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [objectiveToEdit, setObjectiveToEdit] = useState<Objective | null>(
    null,
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Objective | null>(null);
  const [conditionObjective, setConditionObjective] =
    useState<Objective | null>(null);
  const [isReleaseDatesModalOpen, setIsReleaseDatesModalOpen] = useState(false);
  const [releaseDatesObjective, setReleaseDatesObjective] =
    useState<Objective | null>(null);

  const { events } = useGetEvents();
  const { scoringRules } = useGetScoringRulesForEvent(eventId);
  const { rules } = useGetRules(eventId);
  const { objectiveValidations } = useGetObjectiveValidations(eventId);
  const validationMap = objectiveValidations.reduce(
    (map, validation) => {
      map[validation.objective_id] = validation;
      return map;
    },
    {} as Record<number, ObjectiveValidation>,
  );

  const { deleteObjective } = useDeleteObjective(qc, eventId);
  const { createObjective } = useCreateObjective(qc, eventId);
  const { duplicateObjective } = useDuplicateObjective(qc, eventId);

  const objective = findObjective(
    rules,
    (objective) => objective.id === objectiveId,
  );
  const event = events?.find((event) => event.id === eventId);
  const path = getPath(rules, objectiveId);

  const objectiveColumns = useMemo<ColumnDef<Objective>[]>(
    () => [
      objectiveIconColumn(event?.game_version),
      {
        header: "Valid",
        cell: ({ row }) => {
          if (row.original.children.length > 0) {
            return areAllChildrenValidated(row.original, validationMap) ? (
              <span className="text-success">✓</span>
            ) : (
              <span className="text-error">✗</span>
            );
          }
          if (row.original.objective_type !== ObjectiveType.ITEM) {
            return <span className="text-success">✓</span>;
          }

          const validation = validationMap[row.original.id];
          return validation ? (
            <ClipboardDocumentListIcon
              className="size-6 cursor-pointer text-success transition-transform duration-100 select-none hover:text-primary active:scale-110 active:text-secondary"
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(validation.item, null, 2),
                )
              }
            />
          ) : (
            <span className="text-error">✗</span>
          );
        },
        size: 60,
      },
      ...objectiveDetailColumns(),
      scoringRuleColumn(scoringRules),
      conditionsColumn((objective, condition) =>
        createObjective({
          ...objective,
          scoring_rule_ids: objective.scoring_rules.map((rule) => rule.id),
          conditions: objective.conditions.filter((c) => c !== condition),
        }),
      ),
      {
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row gap-2">
              <div
                className="tooltip tooltip-bottom tooltip-warning"
                data-tip="Edit"
              >
                <button
                  className="btn btn-warning btn-xs"
                  onClick={() => {
                    setObjectiveToEdit(row.original);
                    setIsObjectiveModalOpen(true);
                  }}
                >
                  <PencilSquareIcon className="size-4" />
                </button>
              </div>
              <div
                className="tooltip tooltip-bottom tooltip-warning"
                data-tip="Release Dates"
              >
                <button
                  className="btn btn-warning btn-xs"
                  onClick={() => {
                    setReleaseDatesObjective(row.original);
                    setIsReleaseDatesModalOpen(true);
                  }}
                >
                  <ClockIcon className="size-4" />
                </button>
              </div>
              <div
                className="tooltip tooltip-bottom tooltip-error"
                data-tip="Delete"
              >
                <button
                  className="btn btn-error btn-xs"
                  onClick={() => deleteObjective(row.original.id)}
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <div
                className="tooltip tooltip-bottom tooltip-info"
                data-tip="Duplicate"
              >
                <button
                  className="btn btn-info btn-xs"
                  onClick={() => duplicateObjective(row.original)}
                >
                  <DocumentDuplicateIcon className="size-4" />
                </button>
              </div>
              <div
                className="tooltip tooltip-bottom tooltip-success"
                data-tip="Add Condition"
              >
                <button
                  className="btn btn-success btn-xs"
                  onClick={() => {
                    setConditionObjective(row.original);
                    setIsConditionModalOpen(true);
                  }}
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>

              <div
                className="tooltip tooltip-bottom tooltip-secondary"
                data-tip="Open as Category"
              >
                <Link
                  to={"/admin/events/$eventId/objectives/$objectiveId"}
                  params={{ eventId: eventId!, objectiveId: row.original.id }}
                  className="btn btn-secondary btn-xs"
                >
                  <FolderOpenIcon className="size-4" />
                </Link>
              </div>
            </div>
          );
        },
      },
    ],
    [
      event?.game_version,
      validationMap,
      scoringRules,
      createObjective,
      deleteObjective,
      duplicateObjective,
      eventId,
    ],
  );

  const table = useMemo(() => {
    return (
      <VirtualizedTable<Objective>
        className="h-[70vh] w-full"
        columns={objectiveColumns}
        data={objective?.children.sort((a, b) => a.id - b.id) || []}
        sortable={false}
      />
    );
  }, [objective?.children, objectiveColumns]);

  if (!objectiveId || !event) {
    return <></>;
  }
  return (
    <div className="mt-4 flex flex-col gap-4">
      <ObjectiveFormModal
        isOpen={isObjectiveModalOpen}
        setIsOpen={(open) => {
          setIsObjectiveModalOpen(open);
          if (!open) setObjectiveToEdit(null);
        }}
        event={event}
        parentId={objectiveId}
        existingObjective={objectiveToEdit}
      />
      <BulkObjectiveFormModal
        isOpen={isBulkObjectiveModalOpen}
        setIsOpen={setIsBulkObjectiveModalOpen}
        event={event}
        categoryId={objectiveId}
      />
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        setIsOpen={(open) => {
          setIsCategoryModalOpen(open);
          if (!open) setCategoryToEdit(null);
        }}
        event={event}
        parentId={objectiveId}
        existingCategory={categoryToEdit}
      />
      {releaseDatesObjective && (
        <ReleaseDatesFormModal
          isOpen={isReleaseDatesModalOpen}
          setIsOpen={(open) => {
            setIsReleaseDatesModalOpen(open);
            if (!open) setReleaseDatesObjective(null);
          }}
          eventId={eventId}
          objective={releaseDatesObjective}
        />
      )}
      {conditionObjective && (
        <ConditionFormModal
          isOpen={isConditionModalOpen}
          setIsOpen={(open) => {
            setIsConditionModalOpen(open);
            if (!open) setConditionObjective(null);
          }}
          eventId={eventId}
          objective={conditionObjective}
        />
      )}
      <div className="flex w-full flex-col rounded-box bg-base-300 p-4">
        <h1 className="mb-4 text-2xl font-bold">
          Categories and Subcategories
        </h1>
        {path.map((activeId) => {
          const activObjective = findObjective(
            rules,
            (objective) => objective.id === activeId,
          );
          const children = activObjective?.children.filter(
            (child) => child.children.length > 0 || child.id === objectiveId,
          );
          return (
            <div key={"category-" + activeId}>
              {path[0] !== activeId && (
                <div className="divider my-2 divider-primary select-none"></div>
              )}
              <div className="flex flex-row flex-wrap gap-1">
                {children
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((objective) => (
                    <div key={"category-child-" + objective.id}>
                      <Link
                        to={"/admin/events/$eventId/objectives/$objectiveId"}
                        params={{
                          eventId: eventId!,
                          objectiveId: objective.id,
                        }}
                        className={twMerge(
                          "btn",
                          path.includes(objective.id)
                            ? "btn-primary"
                            : "btn-dash",
                        )}
                      >
                        {objective.name}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-center gap-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            setCategoryToEdit(null);
            setIsCategoryModalOpen(true);
          }}
        >
          Create Subcategory
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setCategoryToEdit(objective ?? null);
            setIsCategoryModalOpen(true);
          }}
        >
          Edit this Category
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setObjectiveToEdit(null);
            setIsObjectiveModalOpen(true);
          }}
        >
          Create new Objective
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setIsBulkObjectiveModalOpen(true)}
        >
          Create Objectives in bulk
        </button>
        <Link
          to="/admin/events/$eventId/scoring-rules"
          params={{ eventId }}
          className="btn btn-info"
        >
          Scoring Rules
        </Link>
        <Link
          to="/admin/events/$eventId/objective-help"
          params={{ eventId }}
          className="btn btn-accent"
        >
          Objective Help
        </Link>
        <button
          className="btn btn-success"
          onClick={() =>
            validateObjectivesBase(eventId, { timeout_seconds: 300 }).then(() =>
              qc.invalidateQueries(),
            )
          }
        >
          Validate Objectives
        </button>
      </div>
      {table}
    </div>
  );
}

export default ScoringCategoryPage;
