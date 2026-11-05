import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { useAuthStore } from "@/store";
import { getUsers } from "@/http/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";

const EMPTY_USERS = [];

const Users = () => {
  const { user } = useAuthStore();

  // Query users from API
  const {
    data: users = EMPTY_USERS,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response.data?.users || EMPTY_USERS;
    },
    enabled: user?.role === "admin",
  });

  // Role Protection: Only admins can view this page
  if (user && user.role !== "admin") {
    return <Navigate to="/home" replace={true} />;
  }

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

      {/* Error Alert */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">
            {error?.response?.data?.message ||
              error?.message ||
              "Failed to load users from the server."}
          </span>
        </div>
      )}

      {/* shadcn Data Table */}
      <DataTable columns={columns} data={users} isLoading={isLoading} />
    </div>
  );
};

export default Users;
