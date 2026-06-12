import type { JobType } from "./jobType.ts";

export interface JobCreate {
  duration_in_seconds?: number;
  end_date?: Date;
  event_id?: number;
  job_type?: JobType;
  sleep_after_each_run_seconds?: number;
}
