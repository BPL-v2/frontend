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
import React from "react";
import { twMerge } from "tailwind-merge";
import Select, { SelectOption } from "../form/select";

function Table<T extends RowData>({
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

  return (
    <div
      className={twMerge(
        "overflow-auto rounded-box border border-base-content/20 shadow-xl select-none",
        className,
      )}
    >
      <table
        className={twMerge(
          "table table-auto bg-base-300",
          // Keep intrinsic column sizing based on content.
          "w-max min-w-full",
          styles?.table,
        )}
      >
        <thead
          className={twMerge(
            "sticky top-0 z-1 bg-base-200 text-lg text-highlight-content",
            styles?.header,
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = sortable && header.column.getCanSort();
                const isSorting = !!sorting.find(
                  (sort) => sort.id === header.id,
                );

                return (
                  <th key={header.id} className="align-middle">
                    <div
                      className={
                        canSort ? "flex cursor-pointer items-center gap-1" : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {canSort && (
                        <TableSortIcon
                          className="size-5 select-none"
                          sort={sorting.find((sort) => sort.id === header.id)}
                        ></TableSortIcon>
                      )}
                      <div
                        className={twMerge(
                          "flex flex-row items-center",
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
        <tbody className={styles?.body}>
          {rows.map((row) => (
            <tr
              className={twMerge(
                "hover:bg-base-100",
                rowClassName ? rowClassName(row) : "",
              )}
              style={rowStyle ? rowStyle(row) : undefined}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => {
                const align = (cell.column.columnDef.meta as ColumnDefMeta<T>)?.align;
                const tdDivider = (cell.column.columnDef.meta as ColumnDefMeta<T>)?.dividerRight;
                return (
                  <td
                    key={cell.id}
                    className={twMerge(
                      "align-middle",
                      align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center",
                      tdDivider && "border-r border-base-content/10",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

type ColumnDefMeta<T> = {
  filterVariant?: "string" | "enum" | "boolean";
  filterPlaceholder?: string;
  options?: T[] | SelectOption<T>[];
  align?: "left" | "center" | "right";
  dividerRight?: boolean;
};

function Filter<T extends RowData>({ column }: { column: Column<T, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterPlaceholder, options } =
    (column.columnDef.meta as ColumnDefMeta<T>) ?? {};

  if (filterVariant === "string") {
    return (
      <input
        className="input w-full text-lg"
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
        className="ml-2 size-8 cursor-pointer rounded-full border border-primary bg-base-300 select-none"
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
