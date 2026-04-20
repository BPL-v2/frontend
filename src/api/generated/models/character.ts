export interface Character {
  ascendancy: string;
  ascendancy_points: number;
  atlas_node_count: number;
  event_id: number;
  id: string;
  level: number;
  main_skill: string;
  name: string;
  pantheon: boolean;
  user_id?: number;
  void_stones: number;
}
