// The wishlist "build enabling" field is a 1-5 importance scale rather than a
// plain flag: 1 = nice to have, 5 = the build does not work without it. Legacy
// boolean data was migrated false -> 1 and true -> 5.

export const MIN_BUILD_ENABLING = 1;
export const MAX_BUILD_ENABLING = 5;
export const DEFAULT_BUILD_ENABLING = 1;

// A wish counts as "build enabling" for the quick filter / summaries once it
// reaches this level (previously only true/5 qualified).
export const BUILD_ENABLING_THRESHOLD = 4;

export interface BuildEnablingLevel {
  value: number;
  label: string;
  description: string;
}

export const BUILD_ENABLING_LEVELS: BuildEnablingLevel[] = [
  {
    value: 1,
    label: "Nice to have",
    description: "A small or situational upgrade.",
  },
  {
    value: 2,
    label: "Useful",
    description: "A noticeable upgrade, but not a priority.",
  },
  {
    value: 3,
    label: "Important",
    description: "A meaningful power spike for the build.",
  },
  {
    value: 4,
    label: "Very important",
    description: "The build underperforms badly without it.",
  },
  {
    value: 5,
    label: "Absolutely essential",
    description: "The build does not function without this item.",
  },
];

export function buildEnablingLevel(value: number): BuildEnablingLevel {
  return (
    BUILD_ENABLING_LEVELS.find((l) => l.value === value) ??
    BUILD_ENABLING_LEVELS[0]
  );
}

export function clampBuildEnabling(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_BUILD_ENABLING;
  return Math.min(
    MAX_BUILD_ENABLING,
    Math.max(MIN_BUILD_ENABLING, Math.round(value)),
  );
}

// Multi-line summary of the whole scale, suitable for a tooltip / help icon.
export const BUILD_ENABLING_LEGEND = BUILD_ENABLING_LEVELS.map(
  (l) => `${l.value} - ${l.label}: ${l.description}`,
).join("\n");
