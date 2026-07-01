import { createFileRoute } from "@tanstack/react-router";
import SubmissionTab from "@components/submission-tab";
import { BountyTabRules } from "@rules/bounties";
import { JSX, useContext } from "react";
import { GlobalStateContext } from "@utils/context-provider";

export const Route = createFileRoute("/scores/bounties")({
  component: BountiesPage,
});

function BountiesPage(): JSX.Element {
  const { rules } = Route.useSearch();
  const { scores } = useContext(GlobalStateContext);
  const category = scores?.children.find(
    (category) => category.name === "Bounties",
  );
  if (!category) {
    return <></>;
  }
  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bborder bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">
            <BountyTabRules />
          </article>
        </div>
      ) : null}
      <SubmissionTab category={category} />
    </>
  );
}
