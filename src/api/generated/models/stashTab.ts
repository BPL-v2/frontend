import type { Item } from "./item.ts";
import type { StashTabMetadata } from "./stashTabMetadata.ts";

export interface StashTab {
  children?: StashTab[];
  /** Folder a 10 digit hexadecimal string */
  folder?: string;
  /** Id a 10 digit hexadecimal string */
  id: string;
  index?: number;
  items?: Item[];
  metadata: StashTabMetadata;
  name: string;
  /** Parent a 10 digit hexadecimal string */
  parent?: string;
  type: string;
}
