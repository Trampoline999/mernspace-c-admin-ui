import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import Users from "./Users";
import { useAuthStore } from "@/store";
import { getUsers } from "@/http/api";

vi.mock("@/store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/http/api", () => ({
  getUsers: vi.fn(),
}));

const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    role: "admin",
    email: "john@example.com",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    role: "manager",
    email: "jane@example.com",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

describe("Users Page with Filters, Table, and Drawer", () => {
  let queryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    useAuthStore.mockReturnValue({
      user: { role: "admin" },
    });

    getUsers.mockResolvedValue({
      data: {
        data: mockUsers,
        total: 2,
      },
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders page title, breadcrumb, and static filter toolbar", async () => {
    renderComponent();

    // Verify page heading and breadcrumb
    expect(screen.getByRole("heading", { level: 1, name: "Users" })).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Verify search input
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();

    // Verify Status & Role filter dropdowns
    expect(
      screen.getByRole("combobox", { name: /filter by status/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /filter by role/i })
    ).toBeInTheDocument();

    // Verify no 'ban' filter is present
    expect(screen.queryByLabelText(/filter by ban/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ban/i)).not.toBeInTheDocument();

    // Verify '+ Create users' button
    expect(
      screen.getByRole("button", { name: /create users/i })
    ).toBeInTheDocument();

    // Verify user table rows render
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("opens the create user drawer when '+ Create users' is clicked", async () => {
    renderComponent();

    const createButton = screen.getByRole("button", { name: /create users/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Create User")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Fill in the user details below to create a new user account."
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId("user-form")).toBeInTheDocument();
    });
  });
});
