import { createFileRoute } from "@tanstack/react-router";
import SubmissionTab from "@components/submission-tab";
import { JSX, useContext } from "react";
import { AscendancyChallengeTabRules } from "../../rules-alt/ascendancy-challenges";
import { GlobalStateContext } from "@utils/context-provider";

export const Route = createFileRoute("/scores/ascendancy-challenges")({
  component: AscendancyChallengePage,
});

function AscendancyChallengePage(): JSX.Element {
  const { rules } = Route.useSearch();
  const { scores } = useContext(GlobalStateContext);
  const category = scores?.children.find(
    (category) => category.name === "Ascendancy Challenges",
  );
  if (!category) {
    return <></>;
  }
  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bborder bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">
            <AscendancyChallengeTabRules />
          </article>
        </div>
      ) : null}
      <SubmissionTab category={category} />
    </>
  );
}
