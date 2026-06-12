import type { JobCreate } from "./jobCreate.ts";

export type StartJobBaseBody = { [key: string]: unknown } | JobCreate;
