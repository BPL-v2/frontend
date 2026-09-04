export type AchievementCheckKey =
  (typeof AchievementCheckKey)[keyof typeof AchievementCheckKey];

export const AchievementCheckKey = {
  level_90: "level_90",
  level_95: "level_95",
  level_100: "level_100",
  participated_in_event: "participated_in_event",
  played_5_leagues: "played_5_leagues",
  played_10_leagues: "played_10_leagues",
  played_5_ascendancies: "played_5_ascendancies",
  played_10_ascendancies: "played_10_ascendancies",
  teamlead: "teamlead",
  submitted_bounty: "submitted_bounty",
} as const;
