import React, { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { columns } from "@/components/table/tenantColumn.jsx";
import { DataTable } from "@/shared/DataTable";
import { getTenants } from "@/http/api";
import { TenantDrawer } from "./forms/TenantForm";

const EMPTY_TENANTS = [];
const PER_PAGE = 10;

export const Tenants = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PER_PAGE,
  });

  // Static filter state (UI only, filtering logic deferred)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentPage = pagination.pageIndex + 1;
  const perPage = pagination.pageSize;

  const {
    data: tenantsResponse,
    isLoading,
    isPlaceholderData,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", { currentPage, perPage }],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        currentPage: String(currentPage),
        perPage: String(perPage),
      }).toString();
      const response = await getTenants(queryString);
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const tenants = tenantsResponse?.data || EMPTY_TENANTS;
  const totalTenants = tenantsResponse?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/home" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Restaurants</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Restaurants
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage and view all registered restaurants across the platform.
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium">
          {error?.response?.data?.message ||
            error?.message ||
            "Failed to load restaurants."}
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Top Filter & Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          {/* Left Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 bg-neutral-100/90 dark:bg-neutral-800/90 border-0 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-300 shadow-none"
              />
            </div>

            {/* Status Select Filter (Static UI) */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                aria-label="Filter by status"
                className="h-9 min-w-[120px] bg-neutral-100/90 dark:bg-neutral-800/90 border-0 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 font-normal shadow-none"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right Action: Create Restaurant Drawer Trigger */}
          <Button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="h-9 px-4 bg-[#F65F42] hover:bg-[#e55337] text-white !text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white !text-white" />
            <span className="text-white !text-white">Create restaurant</span>
          </Button>
        </div>

        {/* Table Data */}
        <div
          className={
            isPlaceholderData ? "opacity-60 transition-opacity" : ""
          }
        >
          <DataTable
            columns={columns}
            data={tenants}
            isLoading={isLoading}
            manualPagination={true}
            totalCount={totalTenants}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>

        {/* Create Restaurant Drawer */}
        <TenantDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            setIsDrawerOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Tenants;
