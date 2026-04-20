import type { Action } from './action';

export interface GuildStashChangelog {
  account_name: string;
  action: Action;
  item_name: string;
  number: number;
  stash_name?: string;
  timestamp: number;
}
