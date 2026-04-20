export interface SubmissionCreate {
  comment?: string;
  id?: number;
  number?: number;
  objective_id: number;
  proof?: string;
  timestamp: Date;
}
