import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

export const UserFilters = ({ filters, onFilterChange }) => {

  const handleChange = (key, value) => {
    return onFilterChange({
      ...filters,
      [key]: value
    })
  }
  return (
    <div className="flex items-center gap-3 flex-wrap flex-1">
      {/* Search Input */}
      <div className="relative w-full sm:w-64 md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="pl-9 h-9 bg-neutral-100/90 dark:bg-neutral-800/90 border-0 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-300 shadow-none"
        />
      </div>

      {/* Role Select Filter (Static UI) */}
      <Select value={filters.role} onValueChange={(value) => handleChange("role", value)}>
        <SelectTrigger
          aria-label="Filter by role"
          className="h-9 min-w-[120px] bg-neutral-100/90 dark:bg-neutral-800/90 border-0 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 font-normal shadow-none"
        >
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="employee">Employee</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilters;
