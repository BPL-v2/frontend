import { Item, Rarity } from "@utils/pob";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  item?: Item;
  itemX?: number;
  itemY?: number;
};

export function ItemTooltip({ item, itemX, itemY }: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const maxWidth = Math.min(window.innerWidth - 40, 400);
  const [adjustedPosition, setAdjustedPosition] = useState<{
    left?: number;
    top?: number;
  } | null>(null);

  const basePosition = {
    left: itemX,
    top: (itemY || 0) > 10 ? itemY : 10,
  };

  // Only use adjusted position if it was computed for the same base position
  const [adjustedForPosition, setAdjustedForPosition] = useState<{ left?: number; top?: number } | null>(null);
  const position = adjustedPosition && adjustedForPosition?.left === basePosition.left && adjustedForPosition?.top === basePosition.top
    ? adjustedPosition
    : basePosition;

  const updateAdjustedPosition = () => {
    if (!tooltipRef.current) return;
    let top = basePosition.top;
    let left = basePosition.left;
    if (window.innerHeight < tooltipRef.current.getBoundingClientRect().bottom) {
      top = window.innerHeight - tooltipRef.current.offsetHeight - 10;
    }
    if (window.innerWidth < tooltipRef.current.getBoundingClientRect().right) {
      left = window.innerWidth - tooltipRef.current.offsetWidth - 30;
    }
    setAdjustedForPosition({ left: basePosition.left, top: basePosition.top });
    setAdjustedPosition({ left, top });
  };

  if (!item) return null;

  let headerColor = "";
  let borderColor = "";
  switch (item.rarity) {
    case Rarity.Unique:
      headerColor = "text-unique";
      borderColor = "border-unique";
      break;
    case Rarity.Rare:
      headerColor = "text-rare";
      borderColor = "border-rare";
      break;
    case Rarity.Magic:
      headerColor = "text-magic";
      borderColor = "border-magic";
      break;
    case Rarity.Normal:
      headerColor = "text-normal";
      borderColor = "border-normal";
      break;
  }
  return (
    <div
      ref={(el) => {
        (tooltipRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (el) updateAdjustedPosition();
      }}
      className={twMerge(
        "pointer-events-none fixed z-30 text-xs md:text-base",
        "gap flex flex-col rounded-lg border-2 bg-base-100/80 text-center shadow-lg md:bg-base-100/90",
        position.left != 0 && position.top != 0 ? "block" : "hidden",
        borderColor,
      )}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: maxWidth,
        maxHeight: "90vh",
      }}
    >
      <div
        className={twMerge(
          "flex w-full flex-col p-2 text-sm font-bold md:text-xl",
          headerColor,
        )}
      >
        <p>{item.name}</p>
        <p>{item.name.includes(item.base) ? "" : item.base}</p>
      </div>
      {(item.armour > 0 ||
        item.evasion > 0 ||
        item.energyShield > 0 ||
        item.quality > 0) && (
        <div
          className={twMerge(
            "flex w-full flex-col border-t-2 p-2 md:gap-1",
            borderColor,
          )}
        >
          {item.quality > 0 && (
            <div>
              <span className="text-base-content/70">
                Quality{item.altQuality ? ` (${item.altQuality})` : ""}:{" "}
              </span>
              <span className="text-magic">+{item.quality}% </span>
            </div>
          )}
          {item.armour > 0 && (
            <div>
              <span className="text-base-content/70">Armour: </span>
              <span className="text-magic">{item.armour} </span>
            </div>
          )}
          {item.evasion > 0 && (
            <div>
              <span className="text-base-content/70">Evasion Rating: </span>
              <span className="text-magic">{item.evasion} </span>
            </div>
          )}
          {item.energyShield > 0 && (
            <div>
              <span className="text-base-content/70">Energy Shield: </span>
              <span className="text-magic">{item.energyShield} </span>
            </div>
          )}
        </div>
      )}
      {item.enchants.length > 0 && (
        <div
          className={twMerge(
            "flex w-full flex-col border-t-2 p-2 md:gap-1",
            borderColor,
          )}
        >
          {item.enchants.map((enchant) => (
            <span
              key={enchant.line}
              className={twMerge(
                "text-crafted",
                !item.changedFromLastSnapshot &&
                  enchant.changedFromLastSnapshot &&
                  "bg-info/30",
              )}
            >
              {enchant.line}
            </span>
          ))}
        </div>
      )}
      {item.implicits.length > 0 && (
        <div
          className={twMerge(
            "flex w-full flex-col border-t-2 p-2 md:gap-1",
            borderColor,
          )}
        >
          {item.implicits.map((implicit) => (
            <span
              key={implicit.line}
              className={twMerge(
                "text-magic",
                !item.changedFromLastSnapshot &&
                  implicit.changedFromLastSnapshot &&
                  "bg-info/30",
              )}
            >
              {implicit.line}
            </span>
          ))}
        </div>
      )}
      {(item.explicits.length > 0 || item.mutatedMods.length > 0) && (
        <div
          className={twMerge(
            "flex w-full flex-col border-t-2 p-2 md:gap-1",
            borderColor,
          )}
        >
          {item.explicits.map((explicit) => (
            <span
              key={explicit.line}
              className={twMerge(
                "text-magic",
                explicit.crafted && "text-crafted",
                explicit.fractured && "text-fractured",
                !item.changedFromLastSnapshot &&
                  explicit.changedFromLastSnapshot &&
                  "bg-info/30",
              )}
            >
              {explicit.line}
            </span>
          ))}
          {item.mutatedMods.map((mutated) => (
            <span key={mutated.line} className={"text-mutated"}>
              {mutated.line}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
