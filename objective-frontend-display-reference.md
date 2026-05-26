# Objective frontend display reference

This file is a frontend handoff for objective authoring. It is meant to answer:

1. **What should each objective field be called in the UI?**
2. **How should each enum value be explained to a non-technical user?**
3. **Which options only make sense for certain objective types?**

The enum values below are the current backend values. The frontend should keep using these enum values in payloads, but display the human-friendly labels and descriptions from this document.

## Recommended field labels and help text

| API field                            | Recommended UI label       | Suggested help text                                                                                        |
| ------------------------------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `name`                               | Objective name             | A short title players will understand at a glance.                                                         |
| `objective_type`                     | Objective kind             | What this objective checks: item, player, team, submission, stash tab, or category progress.               |
| `conditions`                         | Match rules                | The filters that decide whether an item, player, submission, or event state matches this objective at all. |
| `required_amount`                    | Target amount              | The number needed to finish this objective.                                                                |
| `tracked_value`                      | What to track              | Which numeric value is measured once something matches.                                                    |
| `tracked_value_explanation`          | Tracking note              | Optional custom explanation shown to authors so unusual tracked values are easier to understand.           |
| `counting_method`                    | How it counts              | If there are multiple matches, this decides which result counts for the team.                              |
| `scoring_rule_ids` / `scoring_rules` | How it gives points        | The point or ranking rules applied after the counted result is calculated.                                 |
| `valid_from`                         | Start time                 | Optional start of the scoring window. Mainly important for time-window-based counting.                     |
| `valid_to`                           | End time                   | Optional end of the scoring window. Mainly important for time-window-based counting.                       |
| `hide_progress`                      | Hide progress from players | Use when progress should be scored normally but not shown publicly during the event.                       |
| `children`                           | Child objectives           | Used for category or bingo-style objectives that derive their result from other objectives.                |
| `extra`                              | Extra                      | Extra objective-specific metadata. Usually hidden unless the selected objective type needs it.             |

## Recommended frontend behavior

1. Filter `tracked_value` options by `objective_type_to_tracked_values`.
2. Show `tracked_value_explanation` whenever the backend provides it.
3. Only show `CHILD_RESULT` as a `counting_method` for category-style objectives.
4. Only show child-based scoring rules for objectives that actually have child objectives.
5. Treat scoring rule `extra` keys as rule-specific advanced settings, not generic objective fields.

## Objective types

| Enum value   | UI label             | Description                                                                              |
| ------------ | -------------------- | ---------------------------------------------------------------------------------------- |
| `ITEM`       | Item objective       | Tracks items that match the configured conditions.                                       |
| `STASH_TAB`  | Stash tab objective  | Tracks values derived from stash tab state rather than a single item.                    |
| `PLAYER`     | Player objective     | Tracks a value from an individual player or character state.                             |
| `TEAM`       | Team objective       | Tracks a team-level result built from player or team state.                              |
| `SUBMISSION` | Submission objective | Scores a manually submitted numeric value.                                               |
| `CATEGORY`   | Category objective   | A parent objective whose result comes from child objectives rather than direct matching. |

## Counting methods (`counting_method`)

These decide which result counts when there are multiple matches.

| Enum value               | UI label                         | Description                                                                                                       | Good for                                                          |
| ------------------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `LATEST_VALUE`           | Latest value                     | Use the most recent recorded value for the team.                                                                  | Ongoing progress objectives where the current state should count. |
| `FIRST_COMPLETION`       | First completion                 | The first team to fully finish wins. If a team is unfinished, its best progress so far is still kept for ranking. | Race objectives.                                                  |
| `FIRST_FRESH_COMPLETION` | First fresh completion           | Like first completion, but only counts results from the latest fresh stash state.                                 | Fresh-find or no-reuse item races.                                |
| `HIGHEST_VALUE`          | Highest value reached            | The team’s best recorded value counts.                                                                            | Max-stat or most-progress objectives.                             |
| `LOWEST_VALUE`           | Lowest value reached             | The team’s lowest recorded value counts.                                                                          | Lowest-wins challenges.                                           |
| `VALUE_CHANGE_IN_WINDOW` | Progress made during time window | Counts how much the value changed between the configured start and end times.                                     | Windowed progress objectives.                                     |
| `CHILD_RESULT`           | Calculated from child objectives | This objective does not read a direct match value. Its result comes from child objectives.                        | Category, meta, and bingo-board parents.                          |

### Notes for frontend copy

- `VALUE_CHANGE_IN_WINDOW` only makes sense if both `valid_from` and `valid_to` are set.
- `FIRST_FRESH_COMPLETION` is specialized and should probably have stronger helper text in the UI.
- `CHILD_RESULT` should usually be hidden unless the objective is a category parent.

## Scoring rules (`scoring_rule`)

These decide how the counted result turns into points or rank.

| Enum value                      | UI label                      | Description                                                                                            | Points behavior                                              |
| ------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `FIXED_POINTS_ON_COMPLETION`    | Fixed points on completion    | Awards a fixed amount of points once the objective is finished.                                        | Uses the first entry in `points`.                            |
| `POINTS_BY_VALUE`               | Points by value               | Converts the counted numeric result directly into points.                                              | Uses `points` as a step table by amount/value.               |
| `RANK_BY_COMPLETION_TIME`       | Rank by completion time       | Finished teams are ranked by who completed first.                                                      | 1st place gets `points[0]`, 2nd gets `points[1]`, and so on. |
| `RANK_BY_HIGHEST_VALUE`         | Rank by highest value         | Teams are ranked by highest counted value. Ties break by earlier timestamp.                            | Rank-based points.                                           |
| `RANK_BY_LOWEST_VALUE`          | Rank by lowest value          | Teams are ranked by lowest counted value. Ties break by earlier timestamp.                             | Rank-based points.                                           |
| `RANK_BY_CHILD_COMPLETION_TIME` | Rank by child completion time | Teams are ranked by when they reached the required number or percentage of completed child objectives. | Rank-based points.                                           |
| `BONUS_PER_CHILD_COMPLETION`    | Bonus per child completion    | Gives points for each completed child objective.                                                       | Repeats the `points` scale across child completions.         |
| `BINGO_BOARD_RANKING`           | Bingo board ranking           | Ranks teams by who completes the required number of bingo lines first.                                 | Rank-based points.                                           |
| `RANK_BY_CHILD_VALUE_SUM`       | Rank by child value sum       | Ranks teams by the sum of child objective values.                                                      | Rank-based points.                                           |

## Scoring rule extra config

These live in `scoring_rule.extra`.

| Extra key                             | UI label                        | Description                                                                                                                              | Used by                         |
| ------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `required_completed_children`         | Required completed children     | Minimum number of child objectives that must be completed before the rule can score.                                                     | `RANK_BY_CHILD_COMPLETION_TIME` |
| `required_completed_children_percent` | Required completed children (%) | Percentage of child objectives that must be completed before the rule can score. Overrides a lower absolute threshold if it is stricter. | `RANK_BY_CHILD_COMPLETION_TIME` |
| `required_bingo_count`                | Required bingo lines            | Number of bingo lines a team must complete before it can score.                                                                          | `BINGO_BOARD_RANKING`           |

## Points array behavior

The frontend agent may want to explain `points` differently depending on the scoring rule.

| Scoring rule style | Suggested explanation                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Fixed completion   | "The first value is awarded when the objective is completed."                                                                                 |
| Rank-based         | "The first value is for 1st place, the second for 2nd, and so on. If there are more ranks than values, the last value continues to be used."  |
| Value-based        | "Each amount/value step uses the matching entry in the points list. If the value grows beyond the list, the last value continues to be used." |
| Per-child bonus    | "Each completed child objective awards the next point value. If there are more completions than values, the last value continues to be used." |

## Tracked values (`tracked_value`) by objective type

The backend already provides the allowed mapping per objective type. The tables below are display recommendations for those enums.

### `ITEM`

| Enum value   | UI label   | Description                                |
| ------------ | ---------- | ------------------------------------------ |
| `STACK_SIZE` | Stack size | Counts the size of the matched item stack. |

### `STASH_TAB`

| Enum value    | UI label          | Description                                                             |
| ------------- | ----------------- | ----------------------------------------------------------------------- |
| `FOSSIL_FUEL` | Fossil fuel total | Tracks the total fossil fuel value found in the relevant stash context. |

### `PLAYER`

| Enum value                             | UI label                        | Description                                                                            |
| -------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| `CHARACTER_LEVEL`                      | Character level                 | The character’s current level.                                                         |
| `DELVE_DEPTH`                          | Delve depth                     | The deepest delve depth reached.                                                       |
| `DELVE_DEPTH_AFTER_100`                | Delve depth after 100           | Delve progress counted beyond depth 100.                                               |
| `WEIGHTED_DELVE_DEPTH`                 | Weighted delve depth            | A weighted delve progress value rather than raw depth alone.                           |
| `TEAM_PLAYERS_WITH_PANTHEON_UNLOCKED`  | Players with pantheon unlocked  | Counts players who have unlocked pantheon progression.                                 |
| `ASCENDANCY_POINTS`                    | Ascendancy points               | Number of ascendancy points earned.                                                    |
| `BLOODLINE_ASCENDANCY_UNLOCKED`        | Bloodline ascendancy unlocked   | Binary-style value for whether the bloodline ascendancy condition is unlocked.         |
| `BLOODLINE_ASCENDANCY_POINTS`          | Bloodline ascendancy points     | Number of bloodline ascendancy points earned.                                          |
| `TEAM_PLAYERS_WITH_ALL_LABS_COMPLETED` | Players with all labs completed | Counts players who have completed all required labs.                                   |
| `PERSONAL_OBJECTIVE_SCORE`             | Personal objective score        | Score earned from personal objectives.                                                 |
| `WEAPON_QUALITY`                       | Weapon quality                  | Quality value on the relevant weapon setup.                                            |
| `ARMOUR_QUALITY`                       | Armour quality                  | Quality value on armour pieces.                                                        |
| `FLASK_QUALITY`                        | Flask quality                   | Quality value on equipped flasks.                                                      |
| `EVASION`                              | Evasion                         | Current evasion value.                                                                 |
| `ENERGY_SHIELD`                        | Energy shield                   | Current energy shield value.                                                           |
| `ARMOUR`                               | Armour                          | Current armour value.                                                                  |
| `HP`                                   | Life                            | Current life total.                                                                    |
| `MANA`                                 | Mana                            | Current mana total.                                                                    |
| `FULL_DPS`                             | Full DPS                        | Total DPS value from the configured player snapshot.                                   |
| `EHP`                                  | Effective health pool           | Effective survivability value.                                                         |
| `MOVEMENT_SPEED_BONUS`                 | Movement speed bonus            | Movement speed increase/bonus value.                                                   |
| `PHYSICAL_MAX_HIT`                     | Physical max hit                | Maximum physical hit survivable.                                                       |
| `ELEMENTAL_MAX_HIT`                    | Elemental max hit               | Maximum elemental hit survivable.                                                      |
| `ATLAS_POINTS`                         | Atlas points                    | Number of atlas passive points earned.                                                 |
| `INFLUENCED_ITEM_COUNT`                | Influenced item count           | Count of equipped influenced items.                                                    |
| `FOULBORN_ITEM_COUNT`                  | Foulborn item count             | Count of equipped foulborn items.                                                      |
| `SOCKETED_GEM_COUNT`                   | Socketed gem count              | Count of socketed gems in the relevant setup.                                          |
| `CORRUPTED_ITEM_COUNT`                 | Corrupted item count            | Count of corrupted equipped items.                                                     |
| `JEWELS_WITH_IMPLICITS_COUNT`          | Jewels with implicits           | Count of equipped jewels with implicit modifiers.                                      |
| `HAS_RARE_ASCENDANCY_PAST_90`          | Rare ascendancy past 90         | Binary-style value for whether a rare ascendancy condition was achieved past level 90. |
| `ENCHANTED_ITEM_COUNT`                 | Enchanted item count            | Count of equipped enchanted items.                                                     |

### `TEAM`

Use the same labels and descriptions as `PLAYER`, but present them as **team result** versions. In practice, the selected `counting_method` decides whether the team result is the latest, highest, lowest, first completion, or windowed change.

### `SUBMISSION`

| Enum value        | UI label        | Description                                 |
| ----------------- | --------------- | ------------------------------------------- |
| `SUBMITTED_VALUE` | Submitted value | Numeric value entered through a submission. |

### `CATEGORY`

| Enum value                        | UI label                        | Description                                               |
| --------------------------------- | ------------------------------- | --------------------------------------------------------- |
| `COMPLETED_CHILD_OBJECTIVE_COUNT` | Completed child objective count | Number of child objectives completed under this category. |

## Suggested grouped option lists

If the frontend wants nicer grouped dropdowns for `tracked_value`, this grouping should read well for authors.

### Character progression

- `CHARACTER_LEVEL`
- `ASCENDANCY_POINTS`
- `BLOODLINE_ASCENDANCY_UNLOCKED`
- `BLOODLINE_ASCENDANCY_POINTS`
- `TEAM_PLAYERS_WITH_ALL_LABS_COMPLETED`
- `TEAM_PLAYERS_WITH_PANTHEON_UNLOCKED`
- `HAS_RARE_ASCENDANCY_PAST_90`

### Delve and atlas

- `DELVE_DEPTH`
- `DELVE_DEPTH_AFTER_100`
- `WEIGHTED_DELVE_DEPTH`
- `ATLAS_POINTS`

### Build stats

- `HP`
- `MANA`
- `ARMOUR`
- `EVASION`
- `ENERGY_SHIELD`
- `FULL_DPS`
- `EHP`
- `MOVEMENT_SPEED_BONUS`
- `PHYSICAL_MAX_HIT`
- `ELEMENTAL_MAX_HIT`

### Gear and equipment

- `WEAPON_QUALITY`
- `ARMOUR_QUALITY`
- `FLASK_QUALITY`
- `INFLUENCED_ITEM_COUNT`
- `FOULBORN_ITEM_COUNT`
- `SOCKETED_GEM_COUNT`
- `CORRUPTED_ITEM_COUNT`
- `JEWELS_WITH_IMPLICITS_COUNT`
- `ENCHANTED_ITEM_COUNT`

### Meta/category scoring

- `PERSONAL_OBJECTIVE_SCORE`
- `COMPLETED_CHILD_OBJECTIVE_COUNT`
- `SUBMITTED_VALUE`
- `STACK_SIZE`
- `FOSSIL_FUEL`

## Short label set for dense UIs

If the UI needs shorter labels in chips or selects:

| Enum value                      | Short label             |
| ------------------------------- | ----------------------- |
| `LATEST_VALUE`                  | Latest                  |
| `FIRST_COMPLETION`              | First finish            |
| `FIRST_FRESH_COMPLETION`        | First fresh finish      |
| `HIGHEST_VALUE`                 | Highest                 |
| `LOWEST_VALUE`                  | Lowest                  |
| `VALUE_CHANGE_IN_WINDOW`        | Window change           |
| `CHILD_RESULT`                  | Child result            |
| `FIXED_POINTS_ON_COMPLETION`    | Fixed completion points |
| `POINTS_BY_VALUE`               | Points by value         |
| `RANK_BY_COMPLETION_TIME`       | Rank by time            |
| `RANK_BY_HIGHEST_VALUE`         | Rank by highest         |
| `RANK_BY_LOWEST_VALUE`          | Rank by lowest          |
| `RANK_BY_CHILD_COMPLETION_TIME` | Rank by child time      |
| `BONUS_PER_CHILD_COMPLETION`    | Bonus per child         |
| `BINGO_BOARD_RANKING`           | Bingo ranking           |
| `RANK_BY_CHILD_VALUE_SUM`       | Rank by child sum       |

## Practical authoring copy

These short sentences should work well as inline helper text:

- **What to track:** "Pick the value this objective should measure."
- **How it counts:** "If there are multiple valid matches, choose which result should count."
- **How it gives points:** "Choose whether this objective gives fixed points, points by value, or ranking points."
- **Target amount:** "The counted value needed to finish the objective."
- **Tracking note:** "Optional backend-provided explanation for unusual tracked values."
