import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { Tenants } from "./Tenants";
import { getTenants } from "@/http/api";

vi.mock("@/http/api", () => ({
  getTenants: vi.fn(),
}));

const mockTenants = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    address: "12 MG Road, Bengaluru",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Seaside Residency",
    address: "88 Marine Drive, Kochi",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

describe("Tenants Page", () => {
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

    getTenants.mockResolvedValue({
      data: {
        data: mockTenants,
        total: 2,
      },
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Tenants />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders page title, breadcrumb, search input, and Create restaurant button", async () => {
    renderComponent();

    // Verify heading and breadcrumbs
    expect(
      screen.getByRole("heading", { level: 1, name: "Restaurants" })
    ).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Verify search and filter
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /filter by status/i })
    ).toBeInTheDocument();

    // Verify Create restaurant button
    expect(
      screen.getByRole("button", { name: /create restaurant/i })
    ).toBeInTheDocument();

    // Verify tenant table rows render
    await waitFor(() => {
      expect(screen.getByText("Grand Palace Hotel")).toBeInTheDocument();
      expect(screen.getByText("12 MG Road, Bengaluru")).toBeInTheDocument();
      expect(screen.getByText("Seaside Residency")).toBeInTheDocument();
    });
  });

  it("opens create restaurant drawer when button is clicked", async () => {
    renderComponent();

    const createButton = screen.getByRole("button", {
      name: /create restaurant/i,
    });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Create Restaurant")).toBeInTheDocument();
      expect(screen.getByTestId("tenant-form")).toBeInTheDocument();
    });
  });
});
