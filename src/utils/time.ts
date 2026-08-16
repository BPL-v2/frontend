import { Event } from "@api";
import { ScoreObjective } from "@mytypes/score";

export function getDeltaTimeBetween(to?: number, from?: number) {
  // If either timestamp or league
  if (!to || !from) {
    return "";
  }
  const ts = to * 1000;
  const fromDate = from * 1000;
  const milliseconds = ts - fromDate;
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) {
    return `${days}d : ${hours}h : ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h : ${minutes}m`;
  }
  return `${minutes}m`;
}

export function hoursAfterEventStartToDate(
  event: Event,
  hours?: number,
): Date | undefined {
  if (hours === undefined) return undefined;
  return new Date(event.event_start_time.getTime() + hours * 60 * 60 * 1000);
}

export function dateToHoursAfterEventStart(
  event: Event,
  date?: Date,
): number | undefined {
  if (!date) return undefined;
  return Math.floor(
    (date.getTime() - event.event_start_time.getTime()) / (60 * 60 * 1000),
  );
}

export function objectiveIsValid(objective?: ScoreObjective): boolean {
  if (!objective) return false;
  const now = new Date();
  if (
    objective.valid_from &&
    objective.valid_from &&
    now < objective.valid_from
  )
    return false;
  if (objective.valid_to && objective.valid_to && now > objective.valid_to)
    return false;
  return true;
}
