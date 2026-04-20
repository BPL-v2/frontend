import type { Item } from "./item";
import type { StashTabMetadata } from "./stashTabMetadata";

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
