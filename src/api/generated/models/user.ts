import type { Permission } from './permission';

export interface User {
  account_name?: string;
  discord_id?: string;
  discord_name?: string;
  display_name: string;
  id: number;
  permissions: Permission[];
  token_expiry_timestamp?: Date;
  twitch_id?: string;
  twitch_name?: string;
}
