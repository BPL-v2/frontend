import type { ValidationRequest } from "./validationRequest.ts";

export type ValidateObjectivesBaseBody =
  | { [key: string]: unknown }
  | ValidationRequest;
