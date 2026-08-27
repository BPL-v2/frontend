import { useEffect, useState } from "react";

export const MAX_VISIBLE_PICKER_ROWS = 10;

interface UseSearchableChecklistOptions<T> {
  items: T[];
  matches: (item: T, query: string) => boolean;
  isSelected: (item: T) => boolean;
  // Keys compared in order when "sort by selected" is on, so a multi-field
  // tiebreak (e.g. [displayName, modText]) is reproduced exactly instead of
  // approximated by concatenating fields into one string.
  sortKeys: (item: T) => string[];
  // The consumer modal's open state. This hook's own filter/sort runs
  // unconditionally (it's called before the consumer's `if (!isOpen) return
  // null` guard, per Rules of Hooks), so a leftover search term would
  // otherwise keep re-filtering `items` on every parent keystroke while the
  // modal sits closed - reset on close closes that gap.
  isOpen: boolean;
}

// Shared by the team sheet's search-and-checklist picker modals (uniques,
// transfigured gems): free-text filtering, an optional "selected first"
// sort, and capping how many rows actually render.
export function useSearchableChecklist<T>({
  items,
  matches,
  isSelected,
  sortKeys,
  isOpen,
}: UseSearchableChecklistOptions<T>) {
  const [search, setSearch] = useState("");
  const [sortBySelected, setSortBySelected] = useState(false);

  useEffect(() => {
    if (isOpen) return;
    setSearch("");
    setSortBySelected(false);
  }, [isOpen]);

  const query = search.toLowerCase();
  const filtered = search
    ? items.filter((item) => matches(item, query))
    : items;
  const ordered = sortBySelected
    ? [...filtered].sort((a, b) => {
        const aSelected = isSelected(a);
        const bSelected = isSelected(b);
        if (aSelected !== bSelected) return aSelected ? -1 : 1;
        const aKeys = sortKeys(a);
        const bKeys = sortKeys(b);
        for (let i = 0; i < Math.max(aKeys.length, bKeys.length); i++) {
          const cmp = (aKeys[i] ?? "").localeCompare(bKeys[i] ?? "");
          if (cmp !== 0) return cmp;
        }
        return 0;
      })
    : filtered;
  const visible = ordered.slice(0, MAX_VISIBLE_PICKER_ROWS);

  return {
    search,
    setSearch,
    sortBySelected,
    setSortBySelected,
    filtered,
    visible,
  };
}
