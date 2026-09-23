import { gems } from "@utils/gems";

const COLOR_CLASSES: Record<string, string> = {
  r: "text-strength",
  g: "text-dexterity",
  b: "text-intelligence",
};

const colorsByVersion = {
  poe1: new Map(gems.poe1.map((gem) => [gem.name, gem.color])),
  poe2: new Map(gems.poe2.map((gem) => [gem.name, gem.color])),
};

export function getGemColorKey(
  name: string,
  gameVersion: keyof typeof gems = "poe1",
): string | undefined {
  const colors = colorsByVersion[gameVersion];
  return (
    colors.get(name) ??
    colors.get(name.replace("Vaal ", "")) ??
    colors.get(name + " Support")
  );
}

export function getGemColor(
  gemName?: string,
  gameVersion: keyof typeof gems = "poe1",
  fallback = "text-base-content",
): string {
  if (!gemName) {
    return fallback;
  }
  const color = getGemColorKey(gemName, gameVersion);
  return (color && COLOR_CLASSES[color]) ?? fallback;
}

// Active (non-support) poe1 gems, transfigured variants included as separate
// entries from their base gem.
export const SKILL_GEMS: string[] = gems.poe1
  .filter((gem) => !gem.is_support)
  .map((gem) => gem.name);

// The single definition of "is this a transfigured gem" - both the sheet's
// main-skill sync and the gem picker's list must agree on this, or a pick
// made in one place can silently vanish from the other's view of the data.
export const TRANSFIGURED_SKILL_GEMS: string[] = gems.poe1
  .filter((gem) => gem.is_transfigured)
  .map((gem) => gem.name);

const transfiguredSet = new Set(TRANSFIGURED_SKILL_GEMS);

export function isTransfiguredGem(gem: string): boolean {
  return transfiguredSet.has(gem);
}
