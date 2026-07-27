import type { StashTabMetadataMap } from "./stashTabMetadataMap.ts";

export interface StashTabMetadata {
  /** Colour 6 digit hex colour */
  colour?: string;
  /** Folder always true if present */
  folder?: boolean;
  /** Map various game specific properties */
  map?: StashTabMetadataMap;
  /** Public always true if present */
  public?: boolean;
}
