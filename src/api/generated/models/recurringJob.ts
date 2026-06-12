import type { JobType } from "./jobType.ts";

export interface RecurringJob {
  end_date: string;
  event_id: number;
  job_type: JobType;
  sleep_after_each_run_seconds: number;
}
