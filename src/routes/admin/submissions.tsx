import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ObjectiveType,
  Permission,
  setBulkSubmissionForAdminBase,
  useGetRules,
} from "@api";
import Select from "@components/form/select";
import { SubmissionsPage } from "@components/pages/submissions-page";
import { GlobalStateContext } from "@utils/context-provider";
import { renderConditionally } from "@utils/token";
import { flatMap } from "@utils/utils";

export const Route = createFileRoute("/admin/submissions")({
  component: renderConditionally(SubmissionPage, [
    Permission.admin,
    Permission.submission_judge,
  ]),
});

function BulkSubmissionForm() {
  const { currentEvent } = useContext(GlobalStateContext);
  const qc = useQueryClient();
  const { rules } = useGetRules(currentEvent.id);
  const submissionObjectives = flatMap(rules).filter(
    (objective) => objective.objective_type === ObjectiveType.SUBMISSION,
  );
  return (
    <form
      className="mb-4 flex flex-col items-center bg-base-200"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const objectiveId = parseInt(formData.get("objective") as string);
        const places = currentEvent.teams
          .map((_, idx) => {
            const place = formData.get("place-" + idx);
            if (!place) {
              alert("You have to select a team for each place");
              return;
            }
            return parseInt(place as string);
          })
          .filter((place) => place !== undefined);
        if (new Set(places).size !== places.length) {
          alert("You have to select different teams for each place");
          return;
        }
        setBulkSubmissionForAdminBase(currentEvent.id, {
          objective_id: objectiveId,
          team_ids: places,
        }).then(() => {
          qc.invalidateQueries({
            queryKey: ["submissions", currentEvent.id],
          });
          form.reset();
        });
      }}
    >
      <fieldset className="m-4 mb-4 fieldset w-md rounded-box bg-base-300 p-4">
        <label className="label">Objective</label>
        <Select
          className="w-full"
          placeholder="Select an objective"
          name="objective"
          required
          options={submissionObjectives.map((objective) => ({
            label: objective.name,
            value: String(objective.id),
          }))}
        ></Select>
        {currentEvent.teams.map((_, idx) => (
          <>
            <label className="label">{idx + 1}. Place</label>
            <Select
              required
              name={"place-" + idx}
              className="w-full"
              placeholder="Select a team"
              options={currentEvent.teams.map((team) => ({
                label: team.name,
                value: String(team.id),
              }))}
            ></Select>
          </>
        ))}
        <button className="btn mt-2 btn-primary" type="submit">
          Submit
        </button>
      </fieldset>
    </form>
  );
}

function SubmissionPage() {
  return <SubmissionsPage header={<BulkSubmissionForm />} showAllValues />;
}
