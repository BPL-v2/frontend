import type { UserUpdate } from "./userUpdate";

export type UpdateUserBaseBody = { [key: string]: unknown } | UserUpdate;
