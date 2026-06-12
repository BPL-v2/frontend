import type { GuildStashChangeResponseEntriesItemAccount } from "./guildStashChangeResponseEntriesItemAccount.ts";

export type GuildStashChangeResponseEntriesItem = {
  account?: GuildStashChangeResponseEntriesItemAccount;
  action?: string;
  id?: string;
  item?: string;
  league?: string;
  stash?: string;
  time?: number;
  x?: number;
  y?: number;
};
