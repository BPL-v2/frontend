import type { UserUpdate } from "./userUpdate.ts";

export type UpdateUserBaseBody = { [key: string]: unknown } | UserUpdate;
