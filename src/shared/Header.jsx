import React from "react";
import { useAuthStore } from "../store";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import { Dropdown } from "antd";
import { Bell, ChevronDown, LogOut } from "lucide-react";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80";

export default function Header() {
  const { user, logout: logoutFromStore } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
    },
  });

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Admin";

  const menuItems = [
    {
      key: "info",
      label: (
        <div className="px-2 py-1.5">
          <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 m-0">
            {displayName}
          </p>
          <p className="text-xs text-neutral-500 capitalize m-0 mt-0.5">
            {user?.role || "Manager"}
          </p>
          {user?.email && (
            <p className="text-xs text-neutral-400 m-0 mt-0.5">
              {user.email}
            </p>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut className="w-4 h-4 text-red-500" />,
      label: <span className="text-red-500 font-medium">Log out</span>,
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logoutMutate();
    }
  };

  return (
    <header className="h-16 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-end shrink-0 z-10">
      {/* Notifications & User profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-full text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>

        {/* User profile icon and dropdown */}
        <Dropdown
          menu={{
            items: menuItems,
            onClick: handleMenuClick,
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center gap-1.5 cursor-pointer p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors select-none">
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shadow-xs shrink-0"
            />
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}

export { Header };

