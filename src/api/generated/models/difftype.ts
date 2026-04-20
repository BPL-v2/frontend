
export type Difftype = typeof Difftype[keyof typeof Difftype];


export const Difftype = {
  Added: 'Added',
  Removed: 'Removed',
  Changed: 'Changed',
  Unchanged: 'Unchanged',
} as const;
