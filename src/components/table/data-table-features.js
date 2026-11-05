import {
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  createPaginatedRowModel,
} from "@tanstack/react-table";

/**
 * TanStack Table v9 Feature Registration
 *
 * Keep features registered at module scope so the feature map is
 * stable and not recomputed on every render.
 *
 * Note: filteredRowModel must be registered before paginatedRowModel
 * so pagination acts on the filtered result set.
 */
export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
});
