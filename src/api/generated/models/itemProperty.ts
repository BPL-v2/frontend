export interface ItemProperty {
  displayMode?: number;
  icon?: string;
  name: string;
  /** Progress rounded to 2 decimal places */
  progress?: number;
  suffix?: string;
  type?: number;
  values: unknown[][];
}
