import type { TimingKey } from './timingKey';

export interface Timing {
  description: string;
  duration_seconds: number;
  key: TimingKey;
}
