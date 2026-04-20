import type { TeamUserCreate } from './teamUserCreate';

export type AddUsersToTeamsBaseBody = { [key: string]: unknown } | TeamUserCreate[];
