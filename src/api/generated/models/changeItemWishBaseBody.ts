import type { UpdateItemWish } from "./updateItemWish.ts";

export type ChangeItemWishBaseBody =
  { [key: string]: unknown } | UpdateItemWish;
