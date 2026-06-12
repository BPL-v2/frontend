import type { CallbackBody } from "./callbackBody.ts";

export type OauthCallbackBaseBody = { [key: string]: unknown } | CallbackBody;
