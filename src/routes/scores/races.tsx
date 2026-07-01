import SubmissionTab from "@components/submission-tab";
import { RaceTabRules } from "@rules/races";
import { createFileRoute } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { JSX, useContext } from "react";

export const Route = createFileRoute("/scores/races")({
  component: RacePage,
});

function RacePage(): JSX.Element {
  const { rules } = Route.useSearch();
  const { scores } = useContext(GlobalStateContext);
  const category = scores?.children.find(
    (category) => category.name === "Races",
  );
  if (!category) {
    return <></>;
  }
  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">
            <RaceTabRules />
          </article>
        </div>
      ) : null}
      <SubmissionTab category={category} />{" "}
    </>
  );
}
