import React, { useState } from "react";
import { useTable, FlexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { features } from "../components/table/data-table-features";

const getPageItems = (pageCount, currentPage) => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i);
  }

  if (currentPage < 4) {
    return [0, 1, 2, 3, 4, "ellipsis-end", pageCount - 1];
  }

  if (currentPage >= pageCount - 4) {
    return [
      0,
      "ellipsis-start",
      pageCount - 5,
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
    ];
  }

  return [
    0,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    pageCount - 1,
  ];
};

export function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "No results.",
  initialPageSize = 10,
  manualPagination = false,
  manualFiltering = false,
  totalCount,
  pagination: controlledPagination,
  onPaginationChange,
}) {
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const isControlledPagination =
    controlledPagination !== undefined && onPaginationChange !== undefined;

  const pagination = isControlledPagination
    ? controlledPagination
    : internalPagination;

  const handlePaginationChange = isControlledPagination
    ? onPaginationChange
    : setInternalPagination;

  const table = useTable({
    features,
    data,
    columns,
    manualPagination,
    ...(manualPagination ? { rowCount: totalCount ?? data.length } : {}),
    state: {
      pagination,
    },
    onPaginationChange: handlePaginationChange,
    manualFiltering
  });

  const pageCount = Math.max(table.getPageCount?.() ?? 1, 1);
  const currentPage = table.state?.pagination?.pageIndex ?? 0;
  const pageSize = table.state?.pagination?.pageSize ?? initialPageSize;
  const totalItems = manualPagination
    ? (totalCount ?? data.length)
    : data.length;

  const startRange = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const endRange = Math.min((currentPage + 1) * pageSize, totalItems);
  const pageItems = getPageItems(pageCount, currentPage);

  return (
    <div className="overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length || 1}
                className="h-24 text-center text-neutral-500 dark:text-neutral-400"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length || 1}
                className="h-24 text-center text-neutral-500 dark:text-neutral-400"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          {/* Showing X to Y of Z */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Showing{" "}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {startRange}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {endRange}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {totalItems}
            </span>{" "}
            users
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed cursor-pointer hover:not-disabled:border-[#F65F42] hover:not-disabled:text-[#F65F42] transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-[1.5]" />
            </button>

            {pageItems.map((item, idx) => {
              if (typeof item === "string") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-neutral-400 select-none"
                  >
                    ...
                  </span>
                );
              }

              const isActive = currentPage === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => table.setPageIndex(item)}
                  className={`w-8 h-8 rounded text-sm flex items-center justify-center cursor-pointer select-none transition-colors ${isActive
                    ? "border border-[#F65F42] text-[#F65F42] bg-white dark:bg-neutral-800 font-medium"
                    : "border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:border-[#F65F42] hover:text-[#F65F42]"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item + 1}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed cursor-pointer hover:not-disabled:border-[#F65F42] hover:not-disabled:text-[#F65F42] transition-colors"
              aria-label="Next page"
            >
              <ChevronRightIcon className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
