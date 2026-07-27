import type { ItemWithCompletions } from "./itemWithCompletions.ts";
import type { StashTabMetadata } from "./stashTabMetadata.ts";

export interface StashTabWithCompletions {
  children?: StashTabWithCompletions[];
  /** Folder a 10 digit hexadecimal string */
  folder?: string;
  /** Id a 10 digit hexadecimal string */
  id: string;
  index?: number;
  items?: ItemWithCompletions[];
  metadata: StashTabMetadata;
  name: string;
  /** Parent a 10 digit hexadecimal string */
  parent?: string;
  type: string;
}
