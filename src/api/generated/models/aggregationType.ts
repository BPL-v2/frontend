
export type AggregationType = typeof AggregationType[keyof typeof AggregationType];


export const AggregationType = {
  SUM_LATEST: 'SUM_LATEST',
  LATEST: 'LATEST',
  EARLIEST: 'EARLIEST',
  EARLIEST_FRESH_ITEM: 'EARLIEST_FRESH_ITEM',
  MAXIMUM: 'MAXIMUM',
  MINIMUM: 'MINIMUM',
  DIFFERENCE_BETWEEN: 'DIFFERENCE_BETWEEN',
  NONE: 'NONE',
} as const;
