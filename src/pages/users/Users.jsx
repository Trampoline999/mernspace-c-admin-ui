import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { columns } from "@/components/table/userColumns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/shared/DataTable";
import { useAuthStore } from "@/store";
import { getUsers } from "@/http/api";
import { UserDrawer } from "./forms/UserForm";
import { UserFilters } from "./UserFilters";
import useDebounce from "@/hooks/useDebounce.js";


const EMPTY_USERS = [];
const PER_PAGE = 10;

const Users = () => {
  const { user } = useAuthStore();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PER_PAGE,
  });


  // Drawer state for Create User
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentPage = pagination.pageIndex + 1;
  const perPage = pagination.pageSize;

  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const debounceSearch = useDebounce(filters.search, 300)

  const {
    data: usersResponse,
    isLoading,
    isPlaceholderData,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", { currentPage, perPage, search: debounceSearch, role: filters.role }],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        currentPage: String(currentPage),
        perPage: String(perPage),
        search: String(debounceSearch),
        role: String(filters.role),
      }).toString();
      const response = await getUsers(queryString);
      return response.data;
    },
    placeholderData: keepPreviousData,
    enabled: user?.role === "admin",
  });

  // Role Protection: Only admins can view this page
  if (user && user.role !== "admin") {
    return <Navigate to="/home" replace={true} />;
  }

  const users = usersResponse?.data || EMPTY_USERS;
  const totalUsers = usersResponse?.total ?? 0;

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
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Users
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage and view all registered users across the platform.
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium">
          {error?.response?.data?.message ||
            error?.message ||
            "Failed to load users."}
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Top Filter & Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <UserFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* Right Action: Create User Drawer Trigger */}
          <Button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="h-9 px-4 bg-[#F65F42] hover:bg-[#e55337] text-white !text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white !text-white" />
            <span className="text-white !text-white">Create users</span>
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
            data={users}
            isLoading={isLoading}
            manualPagination={true}
            manualFiltering={true}
            totalCount={totalUsers}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>

        {/* Create User Drawer */}
        <UserDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onSuccess={() => {
            setIsDrawerOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Users;
