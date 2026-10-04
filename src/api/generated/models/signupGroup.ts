import type { NonSensitiveUser } from "./nonSensitiveUser.ts";

export interface SignupGroup {
  key: string;
  locked: boolean;
  max_size: number;
  members: NonSensitiveUser[];
}
