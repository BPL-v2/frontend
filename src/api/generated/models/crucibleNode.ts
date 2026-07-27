export interface CrucibleNode {
  /** Allocated always true if present */
  allocated?: boolean;
  icon?: string;
  /** In node identifiers of nodes connected to this one */
  in: string[];
  /** IsNotable always true if present */
  isNotable?: boolean;
  /** IsReward always true if present */
  isReward?: boolean;
  /** Orbit the column this node occupies */
  orbit?: number;
  /** OrbitIndex the node's position within the column */
  orbitIndex?: number;
  /** Out node identifiers of nodes this one connects to */
  out: string[];
  reminderText?: string[];
  /** Skill mod hash */
  skill?: string;
  /** Stats stat descriptions */
  stats?: string[];
  /** Tier mod tier */
  tier?: number;
}
