export interface PassiveGroup {
  /** IsProxy always true if present */
  isProxy?: boolean;
  /** Nodes the node identifiers associated with this group */
  nodes: string[];
  orbits: number[];
  /** Proxy identifier of the placeholder node */
  proxy?: string;
  x: number;
  y: number;
}
