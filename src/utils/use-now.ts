import { useSyncExternalStore } from "react";

// Shared clock so components can compare against "now" without calling the
// impure `new Date()` / `Date.now()` during render. All subscribers share a
// single interval, so it is cheap to use in every card of a large grid.
const TICK_MS = 30_000;

let now = new Date();
let interval: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function tick() {
  now = new Date();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!interval) {
    // The clock may be stale after a period without subscribers.
    now = new Date();
    interval = setInterval(tick, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(interval);
      interval = undefined;
    }
  };
}

function getSnapshot() {
  return now;
}

export function useNow(): Date {
  return useSyncExternalStore(subscribe, getSnapshot);
}
