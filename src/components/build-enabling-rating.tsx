import {
  BUILD_ENABLING_LEGEND,
  BUILD_ENABLING_LEVELS,
  clampBuildEnabling,
} from "@mytypes/item-wish";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface BuildEnablingRatingProps {
  value: number;
  // Omit / pass undefined to render read-only (other people's wishes).
  onChange?: (value: number) => void;
  size?: "xs" | "sm" | "md";
  // Unique per row - the radio inputs of one rating share a `name`.
  name: string;
  className?: string;
}

// daisyUI star rating for a wishlist entry's 1-5 "build enabling" importance.
// https://daisyui.com/components/rating/
export function BuildEnablingRating({
  value,
  onChange,
  size = "sm",
  name,
  className,
}: BuildEnablingRatingProps) {
  const readOnly = !onChange;
  // Optimistic local value so the stars react instantly; the incoming prop
  // (server truth, via refetch after the PATCH) wins whenever it changes.
  // This is the "adjust state during render" pattern, not an effect.
  const clamped = clampBuildEnabling(value);
  const [prev, setPrev] = useState(clamped);
  const [current, setCurrent] = useState(clamped);
  if (prev !== clamped) {
    setPrev(clamped);
    setCurrent(clamped);
  }

  return (
    <span
      className={twMerge(
        "rating",
        size === "xs" ? "rating-xs" : size === "md" ? "rating-md" : "rating-sm",
        readOnly ? "pointer-events-none" : "",
      )}
    >
      {BUILD_ENABLING_LEVELS.map((level) => (
        <input
          key={level.value}
          type="radio"
          name={name}
          className="mask bg-warning mask-star-2"
          aria-label={`${level.value} - ${level.label}`}
          title={`${level.label}: ${level.description}`}
          checked={current === level.value}
          disabled={readOnly}
          tabIndex={readOnly ? -1 : 0}
          onChange={() => {
            setCurrent(level.value);
            onChange?.(level.value);
          }}
        />
      ))}
    </span>
  );
}

// Small info marker that explains the whole 1-5 scale on hover. Uses a native
// title (not the daisyUI tooltip) so the five lines actually render as lines.
export function BuildEnablingLegend({ className }: { className?: string }) {
  return (
    <InformationCircleIcon
      className={twMerge(
        "size-4 shrink-0 cursor-help text-base-content/60",
        className,
      )}
      title={BUILD_ENABLING_LEGEND}
    />
  );
}
