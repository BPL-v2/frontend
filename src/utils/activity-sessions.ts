export type ActivitySession = { start: number; end: number };

/** Mirrors determineActiveTime in backend/service/activity-service.go. Times in ms. */
export function computeSessions(
  timestamps: number[],
  thresholdMs: number,
): ActivitySession[] {
  if (timestamps.length === 0) {
    return [];
  }
  const sessions: ActivitySession[] = [];
  let start = timestamps[0];
  let end = timestamps[0];
  for (const t of timestamps.slice(1)) {
    if (t - end > thresholdMs) {
      sessions.push({ start, end });
      start = t;
    }
    end = t;
  }
  sessions.push({ start, end });
  return sessions;
}
