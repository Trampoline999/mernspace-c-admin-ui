import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UserDrawer, UserForm } from "./userForm";

describe("UserForm Component", () => {
  it("renders all form sections, fields, and action buttons", () => {
    render(<UserForm onCancel={vi.fn()} onSubmit={vi.fn()} />);

    // Section Titles
    expect(screen.getByText("Basic info")).toBeInTheDocument();
    expect(screen.getByText("Roles")).toBeInTheDocument();
    expect(screen.getByText("Profile image")).toBeInTheDocument();
    expect(screen.getByText("Security info")).toBeInTheDocument();

    // Fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    // Ensure 'ban' is NOT in the form
    expect(screen.queryByLabelText(/ban/i)).not.toBeInTheDocument();

    // Buttons
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty required fields", async () => {
    const handleSubmit = vi.fn();
    render(<UserForm onSubmit={handleSubmit} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
      expect(screen.getByText("Last name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Please select a role")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(screen.getByText("Confirm password is required")).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("validates password mismatch and invalid email format", async () => {
    render(<UserForm onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: "12345678" } });

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: "mismatch876" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("submits valid form values successfully", async () => {
    const handleSubmit = vi.fn();
    render(
      <UserForm
        initialValues={{
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "9876543210",
          role: "admin",
          designation: "Tech Lead",
        }}
        onSubmit={handleSubmit}
      />
    );

    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "9876543210",
          role: "admin",
          designation: "Tech Lead",
          password: "password123",
          confirmPassword: "password123",
        })
      );
    });
  });

  it("calls onCancel when Cancel button is clicked", () => {
    const handleCancel = vi.fn();
    render(<UserForm onCancel={handleCancel} onSubmit={vi.fn()} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("revokes object URLs when replacing file, removing file, and unmounting", () => {
    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:http://localhost:5173/mock-url-1");
    const revokeObjectURLSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    const { container, unmount } = render(
      <UserForm onCancel={vi.fn()} onSubmit={vi.fn()} />
    );

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    const file1 = new File(["file1"], "avatar1.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file1] } });
    expect(createObjectURLSpy).toHaveBeenCalledWith(file1);

    // Replace file with second image
    createObjectURLSpy.mockReturnValueOnce("blob:http://localhost:5173/mock-url-2");
    const file2 = new File(["file2"], "avatar2.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file2] } });

    // Verify first URL was revoked when replaced
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      "blob:http://localhost:5173/mock-url-1"
    );

    // Unmount and verify second URL is revoked on cleanup
    unmount();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      "blob:http://localhost:5173/mock-url-2"
    );

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});

describe("UserDrawer Component", () => {
  it("renders drawer title, description, and form when open is true", () => {
    render(
      <UserDrawer
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByText("Create User")).toBeInTheDocument();
    expect(
      screen.getByText("Fill in the user details below to create a new user account.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("user-form")).toBeInTheDocument();
  });
});

