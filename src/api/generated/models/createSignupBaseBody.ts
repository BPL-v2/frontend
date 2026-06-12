import type { SignupCreate } from "./signupCreate.ts";

export type CreateSignupBaseBody = { [key: string]: unknown } | SignupCreate;
