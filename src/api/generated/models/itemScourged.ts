export interface ItemScourged {
  /** Level monster level required to progress */
  level?: number;
  progress?: number;
  /** Tier 1-3 for items, 1-10 for maps */
  tier: number;
  total?: number;
}
