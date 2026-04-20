import type { UpdateItemWish } from "./updateItemWish";

export type ChangeItemWishBaseBody =
  | { [key: string]: unknown }
  | UpdateItemWish;
