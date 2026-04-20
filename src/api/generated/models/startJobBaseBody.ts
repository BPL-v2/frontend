import type { JobCreate } from './jobCreate';

export type StartJobBaseBody = { [key: string]: unknown } | JobCreate;
