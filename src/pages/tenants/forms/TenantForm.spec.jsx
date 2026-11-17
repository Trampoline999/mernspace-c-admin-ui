import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { TenantDrawer, TenantForm } from "./TenantForm";

describe("TenantForm Component", () => {
  it("renders only restaurant name and address fields and action buttons", () => {
    render(<TenantForm onCancel={vi.fn()} onSubmit={vi.fn()} />);

    // Section Title
    expect(screen.getByText("Restaurant details")).toBeInTheDocument();

    // Fields
    expect(screen.getByLabelText(/restaurant name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();

    // Ensure user fields, image upload, and status are NOT present
    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/last name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/role/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/image/i)).not.toBeInTheDocument();

    // Buttons
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty required fields", async () => {
    const handleSubmit = vi.fn();
    render(<TenantForm onSubmit={handleSubmit} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Restaurant name is required")).toBeInTheDocument();
      expect(screen.getByText("Restaurant address is required")).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("validates minimum length on blur or change", async () => {
    render(<TenantForm onSubmit={vi.fn()} />);

    const nameInput = screen.getByLabelText(/restaurant name/i);
    fireEvent.change(nameInput, { target: { value: "a" } });

    await waitFor(() => {
      expect(
        screen.getByText("Restaurant name must be between 2 and 100 characters")
      ).toBeInTheDocument();
    });
  });

  it("submits valid tenant form values successfully", async () => {
    const handleSubmit = vi.fn();
    render(
      <TenantForm
        initialValues={{
          name: "Grand Palace Hotel",
          address: "12 MG Road, Bengaluru",
        }}
        onSubmit={handleSubmit}
      />
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Grand Palace Hotel",
          address: "12 MG Road, Bengaluru",
        })
      );
    });
  });

  it("calls onCancel when Cancel button is clicked", () => {
    const handleCancel = vi.fn();
    render(<TenantForm onCancel={handleCancel} onSubmit={vi.fn()} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});

describe("TenantDrawer Component", () => {
  it("renders drawer title, description, and form when open is true", () => {
    render(
      <TenantDrawer
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByText("Create Restaurant")).toBeInTheDocument();
    expect(
      screen.getByText("Fill in the details below to create a new restaurant.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("tenant-form")).toBeInTheDocument();
  });
});
