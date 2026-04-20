export interface GuildStashTab {
  color?: string;
  fetch_enabled: boolean;
  id: string;
  index?: number;
  last_fetch: Date;
  name: string;
  parent_id?: string;
  priority_fetch: boolean;
  type: string;
  user_ids: number[];
}
