import type { Item } from './item';
import type { StashTabMetadata } from './stashTabMetadata';

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
