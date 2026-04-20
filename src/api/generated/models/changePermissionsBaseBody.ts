import type { Permission } from "./permission";

export type ChangePermissionsBaseBody =
  | { [key: string]: unknown }
  | Permission[];
