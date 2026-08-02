export interface SubmissionCreate {
  ascendancy_classes_used?: string[];
  comment?: string;
  gems_used?: string[];
  id?: number;
  number?: number;
  objective_id: number;
  proof?: string;
  timestamp: Date;
}
