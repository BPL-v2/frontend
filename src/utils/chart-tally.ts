import { PieSlice } from "@components/charts/pie-chart";

export function tallyByPlayer(
  entries: { value: string | undefined; player: string }[],
): PieSlice[] {
  const playersByValue = new Map<string, string[]>();
  for (const { value, player } of entries) {
    if (!value) continue;
    if (!playersByValue.has(value)) {
      playersByValue.set(value, []);
    }
    playersByValue.get(value)!.push(player);
  }
  return [...playersByValue.entries()].map(([label, players]) => ({
    label,
    value: players.length,
    players,
  }));
}
