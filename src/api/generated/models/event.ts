import type { GameVersion } from "./gameVersion";
import type { Team } from "./team";

export interface Event {
  application_end_time: Date;
  application_start_time: Date;
  event_end_time: Date;
  event_start_time: Date;
  game_version: GameVersion;
  id: number;
  is_current: boolean;
  is_locked: boolean;
  is_main_event: boolean;
  is_public: boolean;
  max_size: number;
  name: string;
  patch?: string;
  teams: Team[];
  uses_medals: boolean;
  waitlist_size: number;
}
