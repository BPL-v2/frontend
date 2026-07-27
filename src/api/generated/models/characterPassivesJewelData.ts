import type { ItemJewelData } from "./itemJewelData.ts";

/**
 * JewelData the key is the string value of the x property of an item from the jewels array in this request
 */
export type CharacterPassivesJewelData = { [key: string]: ItemJewelData };
