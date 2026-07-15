import type { CreateItemWish } from "./createItemWish.ts";

export type CreateItemWishBaseBody =
  { [key: string]: unknown } | CreateItemWish;
