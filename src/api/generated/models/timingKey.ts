export type TimingKey = (typeof TimingKey)[keyof typeof TimingKey];

export const TimingKey = {
  delay_after_character_is_refetched: "delay_after_character_is_refetched",
  delay_after_po_relevant_character_is_refetched:
    "delay_after_po_relevant_character_is_refetched",
  delay_after_inactive_character_is_refetched:
    "delay_after_inactive_character_is_refetched",
  delay_after_league_account_is_refetched:
    "delay_after_league_account_is_refetched",
  delay_after_po_relevant_league_account_is_refetched:
    "delay_after_po_relevant_league_account_is_refetched",
  delay_after_inactive_league_account_is_refetched:
    "delay_after_inactive_league_account_is_refetched",
  delay_after_pob_is_recalculated: "delay_after_pob_is_recalculated",
  delay_after_character_name_is_refetched:
    "delay_after_character_name_is_refetched",
  character_inactivity_duration: "character_inactivity_duration",
  ladder_update_interval: "ladder_update_interval",
  guildstash_update_interval: "guildstash_update_interval",
  guildstash_priority_fetch_interval: "guildstash_priority_fetch_interval",
  public_stash_update_interval: "public_stash_update_interval",
} as const;
