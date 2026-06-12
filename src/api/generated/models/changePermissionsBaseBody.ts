import type { Permission } from "./permission.ts";

export type ChangePermissionsBaseBody =
  | { [key: string]: unknown }
  | Permission[];
