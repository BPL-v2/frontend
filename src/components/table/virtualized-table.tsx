import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { TableSortIcon } from "@icons/table-sort";
import { flexRender, RowData, SortingState } from "@tanstack/react-table";
import {
  Column,
  ColumnDef,
  Row,
  TableOptions,
  useReactTable,
} from "./react-table-shim";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import { twMerge } from "tailwind-merge";
import Select, { SelectOption } from "../form/select";

function VirtualizedTable<T extends RowData>({
  data,
  columns,
  rowClassName,
  rowStyle,
  className,
  sortable = true,
  styles,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  rowClassName?: (row: Row<T>) => string;
  rowStyle?: (row: Row<T>) => React.CSSProperties;
  className?: string;
  sortable?: boolean;
  styles?: {
    header?: string;
    body?: string;
    table?: string;
  };
}) {
  const tableRef = React.useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const options: TableOptions<T> = {
    data,
    columns,
    ...(sortable ? { onSortingChange: setSorting } : {}),
    state: {
      sorting,
    },
  };

  const table = useReactTable(options);

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 80,
    getScrollElement: () => tableRef.current,
    overscan: 5,
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);
  return (
    <div
      ref={tableRef}
      className={twMerge(
        "overflow-auto rounded-box border border-base-content/20 shadow-xl caret-transparent",
        className,
      )}
    >
      <table className={twMerge("table bg-base-300", styles?.table)}>
        <thead
          className={twMerge(
            "sticky top-0 z-1 bg-base-200 text-lg text-highlight-content",
            styles?.header,
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex" style={{ minWidth: table.getTotalSize(), width: '100%' }}>
              {headerGroup.headers.map((header) => {
                const canSort = sortable && header.column.getCanSort();
                const isSorting = !!sorting.find(
                  (sort) => sort.id === header.id,
                );
                return (
                  <th
                    key={header.id}
                    style={{ width: header.getSize(), minWidth: header.getSize() }}
                    className={twMerge(
                      "flex items-center overflow-clip px-3",
                      (() => {
                        const align = (header.column.columnDef.meta as ColumnDefMeta<T>)?.align;
                        return align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
                      })(),
                    )}
                  >
                    <div
                      className={
                        canSort ? "flex min-w-0 cursor-pointer items-center gap-1 justify-center" : "flex justify-center min-w-0 w-full"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {canSort && (
                        <TableSortIcon
                          className="size-4 shrink-0 caret-transparent"
                          sort={sorting.find((sort) => sort.id === header.id)}
                        ></TableSortIcon>
                      )}
                      <div
                        className={twMerge(
                          "flex min-w-0 flex-row items-center",
                          isSorting ? "text-primary" : "",
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanFilter() && (
                          <Filter column={header.column} />
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          className={styles?.body}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<T>;
            return (
              <tr
                className={twMerge(
                  "absolute flex items-center hover:bg-base-100",
                  rowClassName ? rowClassName(row) : "",
                )}
                style={{
                  ...(rowStyle ? rowStyle(row) : {}),
                  minWidth: table.getTotalSize(),
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                data-index={virtualRow.index}
                ref={(node) => rowVirtualizer.measureElement(node)}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => {
                  const align = (cell.column.columnDef.meta as ColumnDefMeta<T>)?.align;
                  return (
                    <td
                      key={cell.id}
                      className={twMerge(
                        "flex items-center self-stretch px-3",
                        align === "right" ? "justify-end text-right" : align === "center" ? "justify-center text-center" : "justify-start text-left",
                      )}
                      style={{ width: cell.column.getSize(), minWidth: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VirtualizedTable;

type ColumnDefMeta<T> = {
  filterVariant?: "string" | "enum" | "boolean";
  filterPlaceholder?: string;
  options?: T[] | SelectOption<T>[];
  align?: "left" | "center" | "right";
};

function Filter<T extends RowData>({ column }: { column: Column<T, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterPlaceholder, options } =
    (column.columnDef.meta as ColumnDefMeta<T>) ?? {};

  if (filterVariant === "string") {
    return (
      <input
        className="input text-lg font-medium caret-current"
        onChange={(e) => {
          column.setFilterValue(e.target.value);
          e.stopPropagation();
        }}
        placeholder={filterPlaceholder}
        type="string"
        value={(columnFilterValue ?? "") as string}
      />
    );
  }
  if (filterVariant === "enum") {
    return (
      <Select
        onChange={column.setFilterValue}
        value={(columnFilterValue ?? "") as T}
        options={options!}
        fontSize="text-lg"
        placeholder={filterPlaceholder}
      ></Select>
    );
  }

  if (filterVariant === "boolean") {
    return (
      <div
        className="ml-2 size-8 cursor-pointer rounded-full border border-primary bg-base-300 caret-transparent"
        onClick={(e) => {
          const currentValue = column.getFilterValue();
          if (currentValue === undefined) {
            column.setFilterValue(false);
          }
          if (currentValue === false) {
            column.setFilterValue(true);
          }
          if (currentValue === true) {
            column.setFilterValue(undefined);
          }
          e.stopPropagation();
        }}
      >
        {column.getFilterValue() ===
        undefined ? undefined : column.getFilterValue() === false ? (
          <XCircleIcon className="h-full w-full text-error" />
        ) : (
          <CheckCircleIcon className="h-full w-full text-success" />
        )}
      </div>
    );
  }
}
