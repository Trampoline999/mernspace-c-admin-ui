import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./DataTable";
import { columns as userColumns } from "../components/table/columns";

describe("DataTable component", () => {
  const sampleColumns = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
  ];

  const sampleData = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "admin",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      role: "customer",
    },
  ];

  it("renders table headers correctly", () => {
    render(<DataTable columns={sampleColumns} data={sampleData} />);

    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("renders row data in each column correctly", () => {
    render(<DataTable columns={sampleColumns} data={sampleData} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("customer")).toBeInTheDocument();
  });

  it("renders with application user columns and formats values correctly", () => {
    const users = [
      {
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice@example.com",
        role: "admin",
        createdAt: "2026-03-01T00:00:00.000Z",
      },
    ];

    render(<DataTable columns={userColumns} data={users} />);

    expect(screen.getByText("Alice Wonderland")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Created at")).toBeInTheDocument();
  });

  it("renders empty state message when data is empty", () => {
    render(<DataTable columns={sampleColumns} data={[]} />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("renders loading state when isLoading is true", () => {
    render(<DataTable columns={sampleColumns} data={[]} isLoading={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("paginates 10 users per page and navigates pages", () => {
    const twentyFiveUsers = Array.from({ length: 25 }, (_, i) => ({
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: "customer",
    }));

    render(<DataTable columns={sampleColumns} data={twentyFiveUsers} initialPageSize={10} />);

    // First page should show 10 items
    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 1 to 10 of 25 users");
    expect(screen.getByText("User1")).toBeInTheDocument();
    expect(screen.getByText("User10")).toBeInTheDocument();
    expect(screen.queryByText("User11")).not.toBeInTheDocument();

    // Click Next page
    const nextBtn = screen.getByRole("button", { name: /next page/i });
    fireEvent.click(nextBtn);

    // Second page should show next 10 items
    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 11 to 20 of 25 users");
    expect(screen.queryByText("User1")).not.toBeInTheDocument();
    expect(screen.getByText("User11")).toBeInTheDocument();
    expect(screen.getByText("User20")).toBeInTheDocument();
  });

  it("supports manual server-side pagination without re-slicing current page data", () => {
    const page2Users = Array.from({ length: 10 }, (_, i) => ({
      firstName: `ServerUser${i + 11}`,
      lastName: `Last${i + 11}`,
      email: `user${i + 11}@example.com`,
      role: "customer",
    }));

    const handlePaginationChange = vi.fn();

    render(
      <DataTable
        columns={sampleColumns}
        data={page2Users}
        manualPagination={true}
        totalCount={25}
        pagination={{ pageIndex: 1, pageSize: 10 }}
        onPaginationChange={handlePaginationChange}
      />
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent(
      "Showing 11 to 20 of 25 users"
    );
    expect(screen.getByText("ServerUser11")).toBeInTheDocument();
    expect(screen.getByText("ServerUser20")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(handlePaginationChange).toHaveBeenCalledTimes(1);
    const updater = handlePaginationChange.mock.calls[0][0];
    const nextPagination =
      typeof updater === "function"
        ? updater({ pageIndex: 1, pageSize: 10 })
        : updater;
    expect(nextPagination).toEqual({ pageIndex: 2, pageSize: 10 });
  });
});
