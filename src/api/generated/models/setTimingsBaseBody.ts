import type { TimingCreate } from "./timingCreate.ts";

export type SetTimingsBaseBody = { [key: string]: unknown } | TimingCreate[];
