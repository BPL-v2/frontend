/**
 * Realm pc, xbox, or sony
 */
export type Realm = (typeof Realm)[keyof typeof Realm];

export const Realm = {
  pc: "pc",
  poe2: "poe2",
  sony: "sony",
  xbox: "xbox",
} as const;
