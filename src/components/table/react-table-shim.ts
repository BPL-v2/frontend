// Central feature registration for tanstack/react-table v9.
// v9 requires every table to declare which features it uses via `tableFeatures()`,
// and every table type is parameterized over that feature set. Table and
// VirtualizedTable are the only two places `useTable` is called (every column
// definition across the app just plugs into one of them), so the feature set
// only needs to cover what those two components actually use: column
// filtering (Filter, getCanFilter/getFilterValue/setFilterValue), row sorting
// (getCanSort/getToggleSortingHandler), column sizing (the `size` column
// option, getSize/getTotalSize), and column visibility (getVisibleCells).
// Nothing in the app uses grouping, expanding, pinning, pagination, row
// selection, or cell selection/spanning, so those stock features are
// intentionally left out. Re-exports the table types pre-bound to this
// feature set so the rest of the codebase doesn't have to deal with the
// `TFeatures` generic directly.
import {
  type Cell as TsCell,
  type CellContext as TsCellContext,
  type Column as TsColumn,
  type ColumnDef as TsColumnDef,
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_includesString,
  type Header as TsHeader,
  type HeaderGroup as TsHeaderGroup,
  type ReactTable,
  type Row as TsRow,
  type RowData,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  type TableOptions as TsTableOptions,
  type TableState as TsTableState,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

// Only the specific built-in filter/sort functions the app actually
// references by string id (`filterFn: "includesString"`, `sortFn: sortingFns.basic`,
// etc.) are registered here, rather than the whole `filterFns`/`sortFns`
// registries — importing those pulls in every built-in function (arrHas,
// inDateRange, alphanumeric, datetime, ...) whether it's used or not.
export const sortingFns = {
  basic: sortFn_basic,
  text: sortFn_text,
};

const tableFeatureSet = tableFeatures({
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equals: filterFn_equals,
  },
  sortFns: sortingFns,
});

type Features = typeof tableFeatureSet;

export function useReactTable<TData extends RowData>(
  options: TableOptions<TData>,
): ReactTable<Features, TData> {
  return useTable({ features: tableFeatureSet, ...options });
}

export type ColumnDef<TData extends RowData, TValue = unknown> = TsColumnDef<Features, TData, TValue>;
export type Column<TData extends RowData, TValue = unknown> = TsColumn<Features, TData, TValue>;
export type Row<TData extends RowData> = TsRow<Features, TData>;
export type Cell<TData extends RowData, TValue = unknown> = TsCell<Features, TData, TValue>;
export type Header<TData extends RowData, TValue = unknown> = TsHeader<Features, TData, TValue>;
export type HeaderGroup<TData extends RowData> = TsHeaderGroup<Features, TData>;
export type TableOptions<TData extends RowData> = Omit<TsTableOptions<Features, TData>, "features">;
export type TableState = TsTableState<Features>;
export type CellContext<TData extends RowData, TValue = unknown> = TsCellContext<Features, TData, TValue>;
