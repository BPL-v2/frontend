export type StashTabLayoutItem = {
  x: number;
  y: number;
  w: number;
  h: number;
  section?: string;
  scale?: number;
  hidden?: true;
};

export type StashTabLayout = {
  [coords: string]: StashTabLayoutItem;
};

export type StashTabLayoutWrapper =
  | true
  | {
      [coords: string]: StashTabLayoutItem;
    }
  | {
      sections: string[];
      layout: {
        [coords: string]: StashTabLayoutItem;
      };
    };

export function getLayout(
  stashType?: string,
  layout?: StashTabLayoutWrapper,
): StashTabLayout | undefined {
  if (!layout) return undefined;
  if (typeof layout === "boolean") {
    const stashSize = stashType === "PremiumStash" ? 12 : 24;
    const layoutObj: Record<string, StashTabLayoutItem> = {};
    for (let i = 0; i < stashSize; i++) {
      for (let j = 0; j < stashSize; j++) {
        layoutObj[`${i},${j}`] = {
          x: i * 25 + 2,
          y: j * 25 + 2,
          w: 1,
          h: 1,
          scale: 0.55,
        };
      }
    }
    return layoutObj;
  }
  if (layout.layout) {
    return layout.layout as StashTabLayout;
  }
  return layout as StashTabLayout;
}

/**
 * GGG used to ship a `metadata.layout` describing how special stash tabs
 * (essence, currency, fragment, …) are arranged. That information is no longer
 * sent with the tab contents, so when it is missing we synthesize a layout by
 * packing the items into a plain grid, ordered by their in-game coordinates.
 */
export function synthesizeLayout(
  items: { x?: number; y?: number; w?: number; h?: number }[],
  columns = 12,
): StashTabLayout | undefined {
  if (!items.length) return undefined;
  const sorted = [...items].sort(
    (a, b) => (a.y ?? 0) - (b.y ?? 0) || (a.x ?? 0) - (b.x ?? 0),
  );
  // Most items in a special tab share the smallest footprint (e.g. 1x1
  // essences), so snap every cell to that size and squish larger items to fit.
  const cellW = Math.max(1, Math.min(...sorted.map((item) => item.w ?? 1)));
  const cellH = Math.max(1, Math.min(...sorted.map((item) => item.h ?? 1)));
  const perRow = Math.max(1, Math.floor(columns / cellW));
  // leave a little room on the right for the vertical scrollbar
  const pitch = 580 / columns;
  const layout: StashTabLayout = {};
  sorted.forEach((item, idx) => {
    const col = (idx % perRow) * cellW;
    const row = Math.floor(idx / perRow) * cellH;
    layout[`${item.x},${item.y}`] = {
      x: col * pitch + 2,
      y: row * pitch + 2,
      w: cellW,
      h: cellH,
      scale: 12 / columns,
    };
  });
  return layout;
}
