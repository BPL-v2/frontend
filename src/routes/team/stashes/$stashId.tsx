import {
  GuildStashRoute,
  validateStashSearch,
} from "@components/pages/guildstash-view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/team/stashes/$stashId")({
  component: GuildStashRoute,
  validateSearch: validateStashSearch,
});
