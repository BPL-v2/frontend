import { useGetEventStatus, useGetGuilds } from "@api";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { getPermissions, isAdmin } from "@utils/token";
import { useContext } from "react";
import { router } from "../../../../main";

export const Route = createFileRoute("/admin/guild/logs")({
  component: RouteComponent,
});

function RouteComponent() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { guilds = [] } = useGetGuilds(currentEvent.id);
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const permissions = getPermissions();
  if (permissions.length === 0 && !eventStatus?.is_team_lead) {
    return "You do not have permission to view this page.";
  }

  let availableGuilds = guilds;
  if (!isAdmin()) {
    availableGuilds = guilds.filter(
      (guild) => guild.team_id === eventStatus?.team_id,
    );
  }

  if (availableGuilds.length === 0) {
    return (
      <div className="m-4">
        <p>
          No guild found for your team. Make sure to set up guild stash logging
        </p>
        <p>
          Get the tool to collect guild logs from{" "}
          <a
            className="link-info"
            href="https://github.com/BPL-v2/tools/releases/tag/v2.0.0"
          >
            https://github.com/BPL-v2/tools/releases/tag/v2.0.0
          </a>{" "}
          to set up logging.
        </p>
      </div>
    );
  }
  if (router.state.location.pathname === "/admin/guild/logs") {
    router.navigate({
      to: "/admin/guild/logs/$guildId",
      params: { guildId: availableGuilds[0].id },
    });
  }
  return (
    <div className="flex flex-col">
      <div className="m-4 flex items-center gap-4">
        <div>Choose a guild:</div>
        <div className="join">
          {availableGuilds.map((guild) => (
            <Link
              to={`/admin/guild/logs/$guildId`}
              params={{ guildId: guild.id }}
              className="btn join-item btn-primary"
              inactiveProps={{ className: "btn-outline" }}
              key={guild.id}
            >
              {currentEvent.teams.find((team) => team.id === guild.team_id)
                ?.name || guild.name}
            </Link>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
