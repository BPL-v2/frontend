
export type Realm = typeof Realm[keyof typeof Realm];


export const Realm = {
  pc: 'pc',
  sony: 'sony',
  xbox: 'xbox',
  poe2: 'poe2',
} as const;
