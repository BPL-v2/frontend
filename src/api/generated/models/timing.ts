import type { TimingKey } from "./timingKey.ts";

export interface Timing {
  description: string;
  duration_seconds: number;
  key: TimingKey;
}
