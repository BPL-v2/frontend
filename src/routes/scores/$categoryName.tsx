import { useGetEventStatus } from "@api";
import { GenericScoreCategory } from "@components/score-categories/generic-score-category";
import TeamScoreDisplay from "@components/team/team-score";
import { GenericRule } from "@rules/generic-rules";
import { createFileRoute } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext, useState } from "react";

export const Route = createFileRoute("/scores/$categoryName")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      rules: search.rules as boolean,
    };
  },
});

function RouteComponent() {
  const { rules } = Route.useSearch();
  const [teamOverride, setTeamOverride] = useState<number>();
  const { currentEvent } = useContext(GlobalStateContext);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(),
  );
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const selectedTeam =
    teamOverride ??
    eventStatus?.team_id ??
    currentEvent?.teams?.sort((a, b) => b.id - a.id)[0]?.id;
  const { categoryName } = Route.useParams();
  const { scores } = useContext(GlobalStateContext);
  const category = scores?.children.find(
    (cat) =>
      cat.name.toLowerCase().replace(/\s/g, "-") === categoryName.toLowerCase(),
  );
  if (!category) {
    return <div>Category not found</div>;
  }
  return (
    <div className="flex flex-col gap-4 caret-transparent">
      {rules && <GenericRule category={category} />}
      <TeamScoreDisplay
        objective={category}
        selectedTeam={selectedTeam}
        setSelectedTeam={setTeamOverride}
      ></TeamScoreDisplay>
      <GenericScoreCategory
        category={category}
        selectedCategories={selectedCategories}
        handleCategoryClick={(cat) => {
          if (selectedCategories.has(cat.id)) {
            setSelectedCategories(
              new Set(selectedCategories.difference(new Set([cat.id]))),
            );
          } else {
            setSelectedCategories(new Set(selectedCategories.add(cat.id)));
          }
        }}
        selectedTeam={selectedTeam}
      />
    </div>
  );
}
