/**
 * PoE2 only
 */
export type ItemSocketItem =
  (typeof ItemSocketItem)[keyof typeof ItemSocketItem];

export const ItemSocketItem = {
  emerald: "emerald",
  sapphire: "sapphire",
  ruby: "ruby",
  rune: "rune",
  soulcore: "soulcore",
  activegem: "activegem",
  supportgem: "supportgem",
} as const;
