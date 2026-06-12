import type { EventCreate } from "./eventCreate.ts";

export type DuplicateEventBaseBody = { [key: string]: unknown } | EventCreate;
