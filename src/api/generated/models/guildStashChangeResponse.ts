import type { GuildStashChangeResponseEntriesItem } from "./guildStashChangeResponseEntriesItem.ts";

export interface GuildStashChangeResponse {
  entries?: GuildStashChangeResponseEntriesItem[];
  truncated?: boolean;
}
