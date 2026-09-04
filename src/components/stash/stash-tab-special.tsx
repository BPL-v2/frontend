import React, { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Item, StashTabWithCompletions } from "@api";
import {
  getLayout,
  StashTabLayout,
  StashTabLayoutItem,
  StashTabLayoutWrapper,
  synthesizeLayout,
} from "@utils/stash-tabs";

type Props = {
  tab?: StashTabWithCompletions;
  size?: number;
  onItemClick?: (item: Item) => void;
  highlightScoring?: boolean;
  /** When set, items whose id is in the set are emphasised and all others dimmed. */
  highlightedItemIds?: Set<string>;
};

function getMapping(
  item: Item,
  layout: StashTabLayout,
): StashTabLayoutItem | undefined {
  const key = layout[`${item.x},${item.y}`]
    ? `${item.x},${item.y}`
    : `${item.x}`;
  return layout[key];
}

function getStyle(
  mapping: StashTabLayoutItem,
  size: number,
): React.CSSProperties {
  const itemSize = size / 14;
  const canvasSize = size / 600; // Base size for the layout
  return {
    left: (mapping.x ?? 1) * canvasSize,
    top: (mapping.y ?? 1) * canvasSize,
    width: (mapping.w ?? 1) * itemSize * (mapping.scale ?? 1),
    height: (mapping.h ?? 1) * itemSize * (mapping.scale ?? 1),
  };
}

export const StashTabSpecial: React.FC<Props> = ({
  tab,
  size = 1000,
  onItemClick,
  highlightScoring,
  highlightedItemIds,
}) => {
  const items = useMemo(() => {
    return (
      tab?.items?.filter((item) => {
        if (highlightScoring && !item.objective_ids?.length) {
          return false;
        }
        return true;
      }) || []
    );
  }, [tab?.items, highlightScoring]);

  const nativeLayout = getLayout(
    tab?.type,
    // @ts-expect-error - GGG API does not mention layout, but it is sometimes present in the data
    tab?.metadata?.layout as StashTabLayoutWrapper,
  );
  // GGG no longer reliably sends the layout for special tabs — fall back to a
  // packed grid derived from the item coordinates.
  const layout = useMemo(
    () => nativeLayout ?? synthesizeLayout(items),
    [nativeLayout, items],
  );

  // Collect all unique sections from the layout, but only keep those with at least one non-hidden layout item
  const sections = useMemo(() => {
    if (!layout) return [];
    return Array.from(
      new Set(
        Object.values(layout)
          .filter((mapping) => !mapping.hidden)
          .map((mapping) => mapping.section)
          .filter((section) => section !== undefined),
      ),
    );
  }, [layout]);
  // Section state — override pattern: user selection overrides, but resets when sections list changes
  const [selectedSectionOverride, setSelectedSection] = useState<
    string | undefined
  >(undefined);
  const selectedSection =
    selectedSectionOverride !== undefined &&
    sections.includes(selectedSectionOverride)
      ? selectedSectionOverride
      : sections.length > 0
        ? sections[0]
        : "";
  if (!tab || !tab.metadata || !layout) return null;

  // Filter layout by section if sections exist
  const filteredLayout =
    sections.length > 0
      ? Object.entries(layout).filter(
          ([, mapping]) =>
            !mapping.hidden &&
            (mapping.section === selectedSection ||
              mapping.section === undefined),
        )
      : Object.entries(layout).filter(([, mapping]) => !mapping.hidden);

  // Filter items by section if sections exist
  const filteredItems =
    sections.length > 0
      ? items.filter((item) => {
          const mapping = getMapping(item, layout);
          return (
            mapping &&
            !mapping.hidden &&
            (mapping.section === selectedSection ||
              mapping.section === undefined)
          );
        })
      : items.filter((item) => {
          const mapping = getMapping(item, layout);
          return mapping && !mapping.hidden;
        });
  return (
    <div className="relative">
      {sections.length > 0 && (
        <div className="absolute top-2 left-2 join z-10 mb-4">
          {sections.map((section) => (
            <button
              key={section}
              className={`btn join-item btn-sm ${
                selectedSection === section ? "btn-primary" : "bg-base-300"
              }`}
              onClick={() => setSelectedSection(section)}
              type="button"
            >
              {section}
            </button>
          ))}
        </div>
      )}
      <div
        className="relative overflow-x-hidden overflow-y-auto rounded-lg border border-base-300 bg-base-200"
        style={{ width: size, height: size }}
      >
        {filteredLayout.map(([key, mapping]: [string, StashTabLayoutItem]) => {
          return (
            <div
              id={`empty-${key}`}
              key={`empty-${key}`}
              className="absolute rounded border border-base-200 bg-base-300 select-none"
              style={{
                ...getStyle(mapping, size),
                pointerEvents: "none",
              }}
            />
          );
        })}

        {filteredItems?.map((item, idx) => {
          const mapping = getMapping(item, layout);
          if (!mapping) return null;
          // The synthesized layout snaps every item to a uniform cell; only
          // native GGG layouts describe per-item sizes.
          if (nativeLayout) {
            mapping.w = Math.max(mapping.w, item.w || 1);
            mapping.h = Math.max(mapping.h, item.h || 1);
          }
          const highlightClass = !highlightedItemIds
            ? ""
            : highlightedItemIds.has(item.id ?? "")
              ? "z-10 ring-2 ring-primary"
              : "opacity-30";
          return (
            <div
              key={idx}
              className={twMerge(
                "absolute flex cursor-pointer items-center justify-center rounded border border-base-300 bg-base-100 p-1 transition-opacity select-none",
                highlightClass,
              )}
              style={getStyle(mapping, size)}
              onClick={() => onItemClick?.(item)}
            >
              <div
                className="tooltip-white tooltip relative tooltip-bottom flex h-full w-full cursor-pointer items-center justify-center overflow-hidden"
                data-tip={`${item.name} ${item.typeLine}`}
              >
                <img
                  src={item.icon!}
                  alt={item.name}
                  tabIndex={0}
                  className="max-h-full max-w-full object-contain"
                />{" "}
                {(item.stackSize || 0) > 0 && (
                  <div
                    className={twMerge(
                      "absolute top-0 left-0 rounded-br bg-black/75 px-0.5 text-xs leading-tight font-semibold text-white tabular-nums select-none",
                      item.frameTypeId === "DivinationCard" &&
                        (item.stackSize || 0) >=
                          (item.maxStackSize || Infinity) &&
                        "text-info",
                    )}
                  >
                    {item.stackSizeText || item.stackSize}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
