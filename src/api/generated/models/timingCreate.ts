import type { TimingKey } from './timingKey';

export interface TimingCreate {
  duration_seconds: number;
  key: TimingKey;
}
