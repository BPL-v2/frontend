export interface DelveProgressionEntry {
  character_id: string;
  character_name: string;
  duration_seconds: number;
  from_time: Date;
  to_time: Date;
  user_id?: number;
}
