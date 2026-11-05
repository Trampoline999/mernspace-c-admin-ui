import React from "react";

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=120&h=120&q=80",
];

export const getAvatar = (user, idx) => {
  if (user?.avatar) return user.avatar;
  return AVATARS[idx % AVATARS.length];
};

export const formatDate = (dateValue) => {
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

export const columns = [
  {
    accessorKey: "userName",
    header: () => <span>user name</span>,
    cell: ({ row }) => {
      const u = row.original;
      const fullName =
        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
        u.name ||
        "User";
      return (
        <div className="flex items-center gap-3">
          <img
            src={getAvatar(u, row.index)}
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
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const role = (row.getValue(columnId) || "").toLowerCase();
      return role === filterValue.toLowerCase();
    },
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
];

