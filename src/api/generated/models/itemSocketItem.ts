/**
 * Item PoE2 only; emerald, sapphire, ruby, rune, soulcore, primaltalisman, vividtalisman, wildtalisman, sacredtalisman, activegem, or supportgem
 */
export type ItemSocketItem =
  (typeof ItemSocketItem)[keyof typeof ItemSocketItem];

export const ItemSocketItem = {
  activegem: "activegem",
  emerald: "emerald",
  primaltalisman: "primaltalisman",
  ruby: "ruby",
  rune: "rune",
  sacredtalisman: "sacredtalisman",
  sapphire: "sapphire",
  soulcore: "soulcore",
  supportgem: "supportgem",
  vividtalisman: "vividtalisman",
  wildtalisman: "wildtalisman",
} as const;
