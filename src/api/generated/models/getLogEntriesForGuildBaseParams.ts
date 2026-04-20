
export type GetLogEntriesForGuildBaseParams = {
/**
 * Limit
 */
limit?: number;
/**
 * Offset
 */
offset?: number;
/**
 * Name of the user doing the action (Make sure to replace the pound sign with a minus)
 */
username?: string;
/**
 * Name of the item (Can be partial)
 */
itemname?: string;
/**
 * Name of the stash tab
 */
stashname?: string;
};
