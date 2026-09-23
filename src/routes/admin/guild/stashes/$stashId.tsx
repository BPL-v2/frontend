import {
  GuildStashRoute,
  validateStashSearch,
} from "@components/pages/guildstash-view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/guild/stashes/$stashId")({
  component: GuildStashRoute,
  validateSearch: validateStashSearch,
});
