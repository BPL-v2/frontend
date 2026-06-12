import type { Item } from "./item.ts";
import type { StashTabMetadata } from "./stashTabMetadata.ts";

export interface GuildStashTabGGG {
  children?: GuildStashTabGGG[];
  id?: string;
  index?: number;
  items?: Item[];
  metadata?: StashTabMetadata;
  name?: string;
  parent?: string;
  type?: string;
}
