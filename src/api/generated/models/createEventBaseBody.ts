import type { EventCreate } from "./eventCreate";

export type CreateEventBaseBody = { [key: string]: unknown } | EventCreate;
