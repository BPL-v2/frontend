import type { ItemRewardRewards } from "./itemRewardRewards.ts";

export interface ItemReward {
  label: string;
  /** Rewards the key is a string representing the type of reward. The value is the amount */
  rewards: ItemRewardRewards;
}
