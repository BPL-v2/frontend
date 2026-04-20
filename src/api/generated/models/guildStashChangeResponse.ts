import type { GuildStashChangeResponseEntriesItem } from './guildStashChangeResponseEntriesItem';

export interface GuildStashChangeResponse {
  entries?: GuildStashChangeResponseEntriesItem[];
  truncated?: boolean;
}
