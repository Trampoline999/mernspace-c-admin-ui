import React, { useMemo, useState } from "react";
import { useTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  Users as UsersIcon,
} from "lucide-react";
import { features } from "./data-table-features";
import { FilterDropdown } from "./filter-dropdown";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Customer", value: "customer" },
];

/**
 * Calculates page numbers to display with a dynamic sliding window
 */
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
  columns,
  data = [],
  isLoading = false,
  initialPageSize = 10,
  onCreateUser,
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Global search handler: resets pageIndex to 0
  const handleGlobalFilterChange = (value) => {
    setGlobalFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Role filter handler: sets TanStack column filter and resets page
  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setColumnFilters((prev) => {
      const others = prev.filter((f) => f.id !== "role");
      if (!value) return others;
      return [...others, { id: "role", value }];
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Status filter handler
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Filter data by status if active
  const filteredData = useMemo(() => {
    if (!statusFilter) return data;
    return data.filter((u) => {
      const userStatus = (u.status || "active").toLowerCase();
      return userStatus === statusFilter.toLowerCase();
    });
  }, [data, statusFilter]);

  // TanStack Table v9 setup
  const table = useTable({
    features,
    columns,
    data: filteredData,
    state: {
      pagination,
      globalFilter,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = (filterValue || "").toLowerCase().trim();
      if (!search) return true;
      const u = row.original;
      const fullName =
        `${u.firstName || ""} ${u.lastName || ""}`.trim().toLowerCase();
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return (
        fullName.includes(search) ||
        name.includes(search) ||
        email.includes(search) ||
        role.includes(search)
      );
    },
  });

  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = table.state?.pagination?.pageIndex ?? 0;
  const pageSize = table.state?.pagination?.pageSize ?? initialPageSize;
  const filteredRows = table.getFilteredRowModel().rows;
  const totalItems = filteredRows.length;

  const startRange = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const endRange = Math.min((currentPage + 1) * pageSize, totalItems);
  const pageItems = getPageItems(pageCount, currentPage);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xs border border-neutral-100 dark:border-neutral-800 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex items-center w-full sm:w-64 bg-neutral-100/70 hover:bg-neutral-100/90 dark:bg-neutral-800/80 dark:hover:bg-neutral-800 rounded-[6px] border border-neutral-200/40 dark:border-neutral-700/40 px-3 py-2 text-neutral-500 transition-[border-color,background-color,box-shadow] duration-150 ease-out focus-within:border-[#F65F42]/50 focus-within:ring-2 focus-within:ring-[#F65F42]/15">
            <SearchIcon className="w-4 h-4 text-neutral-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => handleGlobalFilterChange(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          {/* Status Dropdown - Greyed out when not in use */}
          <FilterDropdown
            placeholder="Status"
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={handleStatusFilterChange}
          />

          {/* Role Dropdown - Greyed out when not in use */}
          <FilterDropdown
            placeholder="Role"
            value={roleFilter}
            options={ROLE_OPTIONS}
            onChange={handleRoleFilterChange}
          />
        </div>

        {/* Create users Button */}
        <button
          type="button"
          onClick={onCreateUser}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#F65F42] hover:bg-[#e04f33] active:scale-[0.97] !text-white text-sm font-medium rounded-[6px] shadow-xs shadow-[#F65F42]/20 transition-[background-color,transform,box-shadow] duration-150 ease-out cursor-pointer focus-visible:ring-2 focus-visible:ring-[#F65F42]/40 focus-visible:ring-offset-1 focus-visible:outline-none shrink-0"
        >
          <PlusIcon className="w-4 h-4 stroke-[2.5] !text-white text-white shrink-0" />
          <span className="!text-white text-white font-medium">Create users</span>
        </button>
      </div>

      {/* Table Data */}
      <Table>
        <TableHeader className="bg-neutral-100/70 dark:bg-neutral-800/80">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="py-4 px-8 text-sm font-medium text-neutral-400 dark:text-neutral-400"
                >
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {isLoading ? (
            // Skeleton Loader Rows
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRow
                key={idx}
                className="animate-pulse border-b border-neutral-100 dark:border-neutral-800"
              >
                <TableCell className="py-5 px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
                    <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
                  </div>
                </TableCell>
                <TableCell className="py-5 px-8">
                  <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
                </TableCell>
                <TableCell className="py-5 px-8">
                  <div className="h-4 w-36 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
                </TableCell>
                <TableCell className="py-5 px-8">
                  <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800 transition-colors"
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} className="py-5 px-8">
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Empty State
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-12 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <UsersIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    No users match your criteria
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-8 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40">
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 rounded-[4px] border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed cursor-pointer hover:not-disabled:border-[#F65F42] hover:not-disabled:text-[#F65F42] transition-[color,border-color,transform] duration-150 ease-out active:not-disabled:scale-95 focus-visible:ring-2 focus-visible:ring-[#F65F42]/30 focus-visible:outline-none"
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
                  className={`w-8 h-8 rounded-[4px] text-sm flex items-center justify-center cursor-pointer select-none transition-[color,border-color,background-color,transform] duration-150 ease-out active:scale-95 focus-visible:ring-2 focus-visible:ring-[#F65F42]/30 focus-visible:outline-none ${
                    isActive
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
              className="w-8 h-8 rounded-[4px] border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 disabled:text-neutral-300 dark:disabled:text-neutral-600 disabled:cursor-not-allowed cursor-pointer hover:not-disabled:border-[#F65F42] hover:not-disabled:text-[#F65F42] transition-[color,border-color,transform] duration-150 ease-out active:not-disabled:scale-95 focus-visible:ring-2 focus-visible:ring-[#F65F42]/30 focus-visible:outline-none"
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
