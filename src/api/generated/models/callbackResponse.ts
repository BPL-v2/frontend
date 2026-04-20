import type { User } from "./user";

export interface CallbackResponse {
  auth_token: string;
  last_path: string;
  user: User;
}
