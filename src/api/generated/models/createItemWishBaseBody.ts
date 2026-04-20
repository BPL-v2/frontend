import type { CreateItemWish } from "./createItemWish";

export type CreateItemWishBaseBody =
  | { [key: string]: unknown }
  | CreateItemWish;
