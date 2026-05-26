import { Permission } from "@api";
import { useGetRules } from "@api";
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import { renderConditionally } from "@utils/token";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/events/$eventId/objectives")({
  component: renderConditionally(RouteComponent, [
    Permission.admin,
    Permission.objective_designer,
    Permission.manager,
  ]),
  params: {
    parse: (params) => ({
      eventId: Number(params.eventId),
    }),
    stringify: (params) => ({
      eventId: params.eventId.toString(),
    }),
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });
  const { eventId } = useParams({ from: Route.id });
  const { rules, isPending, isError } = useGetRules(eventId);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isObjectiveIndexPage = pathname === `/admin/events/${eventId}/objectives`;

  useEffect(() => {
    if (!isObjectiveIndexPage || !rules?.id) {
      return;
    }

    navigate({
      to: "/admin/events/$eventId/objectives/$objectiveId",
      params: { eventId, objectiveId: rules.id },
      replace: true,
    });
  }, [eventId, isObjectiveIndexPage, navigate, rules?.id]);

  if (!isObjectiveIndexPage) {
    return <Outlet />;
  }

  if (isPending) {
    return <div>Loading objectives...</div>;
  }

  if (isError) {
    return <div>Error loading objectives.</div>;
  }

  return <div>Opening objective authoring...</div>;
}
