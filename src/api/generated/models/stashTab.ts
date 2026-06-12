import type { Item } from "./item.ts";
import type { StashTabMetadata } from "./stashTabMetadata.ts";

export interface StashTab {
  children?: StashTab[];
  id?: string;
  index?: number;
  items?: Item[];
  metadata?: StashTabMetadata;
  name?: string;
  parent?: string;
  type?: string;
}
