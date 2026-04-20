
/**
 * PoE2 only
 */
export type ItemSocketType = typeof ItemSocketType[keyof typeof ItemSocketType];


export const ItemSocketType = {
  gem: 'gem',
  jewel: 'jewel',
  rune: 'rune',
} as const;
