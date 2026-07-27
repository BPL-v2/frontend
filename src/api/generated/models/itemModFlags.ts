export interface ItemModFlags {
  /** Crafted always true if present */
  crafted?: boolean;
  /** Desecrated PoE2 only; always true if present */
  desecrated?: boolean;
  /** Fractured always true if present */
  fractured?: boolean;
  /** Mutated always true if present */
  mutated?: boolean;
  /** Vestigial PoE1 only; always true if present */
  vestigial?: boolean;
}
