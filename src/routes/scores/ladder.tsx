import { JSX } from "react";

import { preloadLadderData } from "@api";
import { POPointRules } from "@rules/po-points";
import { createFileRoute } from "@tanstack/react-router";
import { PoDisplay } from "@components/po-display";
import { LadderDisplay } from "@components/ladder-display";
import { TeamScoreTable } from "@components/team-score-table";

export const Route = createFileRoute("/scores/ladder")({
  component: LadderTab,
  // @ts-ignore context is not typed
  loader: async ({ context: { queryClient } }) => {
    preloadLadderData(queryClient);
  },
});

function LadderTab(): JSX.Element {
  const { rules } = Route.useSearch();
  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">
            <POPointRules />
          </article>
        </div>
      ) : null}
      <TeamScoreTable />
      <PoDisplay />
      <LadderDisplay />
    </>
  );
}
