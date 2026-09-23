import { Permission } from "@api";

/** Route `params` option that turns the `$eventId` path segment into a number. */
export const eventIdParams = {
  parse: (params: { eventId: string }) => ({
    eventId: Number(params.eventId),
  }),
  stringify: (params: { eventId: number }) => ({
    eventId: params.eventId.toString(),
  }),
};

export const OBJECTIVE_DESIGNER_PERMISSIONS = [
  Permission.admin,
  Permission.objective_designer,
];

export const OBJECTIVE_MANAGER_PERMISSIONS = [
  ...OBJECTIVE_DESIGNER_PERMISSIONS,
  Permission.manager,
];
