import type { TimingKey } from "./timingKey.ts";

export interface TimingCreate {
  duration_seconds: number;
  key: TimingKey;
}
