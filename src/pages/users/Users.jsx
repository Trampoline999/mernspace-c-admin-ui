import React, { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getUsers } from "@/http/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Users as UsersIcon } from "lucide-react";

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=120&h=120&q=80",
];

const getAvatar = (user, idx) => {
  if (user?.avatar) return user.avatar;
  return AVATARS[idx % AVATARS.length];
};

const formatDate = (dateValue) => {
  if (!dateValue) return "25 July 2022";
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "25 July 2022";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "25 July 2022";
  }
};

const Users = () => {
  const { user } = useAuthStore();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response.data?.users || [];
    },
    enabled: user?.role === "admin",
  });

  if (user && user.role !== "admin") {
    return <Navigate to="/home" replace={true} />;
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "userName",
        header: () => <span>user name</span>,
        cell: ({ row }) => {
          const user = row.original;
          const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.name ||
            "User";
          return (
            <div className="flex items-center gap-3">
              <img
                src={getAvatar(user, row.index)}
                alt={fullName}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-100 dark:border-neutral-700 shadow-2xs"
              />
              <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 whitespace-nowrap">
                {fullName}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: () => <span>Role</span>,
        cell: ({ row }) => {
          const role = row.getValue("role");
          return (
            <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize whitespace-nowrap">
              {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Customer"}
            </span>
          );
        },
      },
      {
        accessorKey: "email",
        header: () => <span>email</span>,
        cell: ({ row }) => (
          <span className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
            {row.getValue("email")}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: () => <span>Created at</span>,
        cell: ({ row }) => {
          const createdAt = row.getValue("createdAt") || row.original.createdAt;
          return (
            <span className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              {formatDate(createdAt)}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Users
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage and view all registered users across the platform.
          </p>
        </div>
      </div>

      {/* Error State */}
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

      {/* Users Table Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xs border border-neutral-100 dark:border-neutral-800 overflow-hidden">
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {isLoading ? (
              // Skeleton Loading Rows
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5 px-8">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UsersIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      No users found in database
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
