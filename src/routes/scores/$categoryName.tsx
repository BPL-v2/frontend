import { GenericScoreCategory } from "@components/score-categories/generic-score-category";
import { createFileRoute } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext } from "react";

export const Route = createFileRoute("/scores/$categoryName")({
  component: RouteComponent,
});

function RouteComponent() {
  const { categoryName } = Route.useParams();
  const { scores } = useContext(GlobalStateContext);
  const category = scores?.children.find(
    (cat) =>
      cat.name.toLowerCase().replace(/\s/g, "-") === categoryName.toLowerCase(),
  );
  return <GenericScoreCategory category={category} />;
}
