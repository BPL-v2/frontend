import type { EventCreate } from "./eventCreate.ts";

export type CreateEventBaseBody = { [key: string]: unknown } | EventCreate;
