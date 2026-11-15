import React, { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FolderUp, Inbox, Plus, Save, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateField, validateUserForm } from "./userFormSchema";

export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "customer", label: "Customer" },
];

const cardClassName =
  "bg-white dark:bg-neutral-900 rounded-xl shadow-2xs border border-neutral-200/80 dark:border-neutral-800 p-5 gap-4";
const cardTitleClassName =
  "text-[15px] font-semibold text-neutral-900 dark:text-neutral-100";
const fieldLabelClassName =
  "text-xs font-medium text-neutral-600 dark:text-neutral-400";
const inputClassName =
  "h-9 rounded-md border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400";

export function UserForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    initialValues?.profileImagePreview || null
  );
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const form = useForm({
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      phoneNumber: initialValues?.phoneNumber || "",
      role: initialValues?.role || "",
      designation: initialValues?.designation || "",
      password: "",
      confirmPassword: "",
      profileImage: initialValues?.profileImage || null,
    },
    validators: {
      onSubmit: ({ value }) => validateUserForm(value),
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
  });

  const handleFileChange = (file) => {
    if (!file) return;
    form.setFieldValue("profileImage", file);

    // Revoke previous object URL if one was created
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    form.setFieldValue("profileImage", null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      data-testid="user-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Basic info Card */}
      <Card className={cardClassName}>
        <CardHeader className="p-0 pb-1">
          <CardTitle className={cardTitleClassName}>Basic info</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="firstName"
              validators={{
                onChange: ({ value }) => validateField("firstName", value),
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={hasError || undefined}>
                    <FieldLabel
                      htmlFor={field.name}
                      className={fieldLabelClassName}
                    >
                      First name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={hasError || undefined}
                      className={inputClassName}
                    />
                    {hasError && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="lastName"
              validators={{
                onChange: ({ value }) => validateField("lastName", value),
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={hasError || undefined}>
                    <FieldLabel
                      htmlFor={field.name}
                      className={fieldLabelClassName}
                    >
                      Last name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={hasError || undefined}
                      className={inputClassName}
                    />
                    {hasError && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => validateField("email", value),
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={hasError || undefined}>
                    <FieldLabel
                      htmlFor={field.name}
                      className={fieldLabelClassName}
                    >
                      email
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={hasError || undefined}
                      className={inputClassName}
                    />
                    {hasError && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="phoneNumber">
              {(field) => (
                <Field>
                  <FieldLabel
                    htmlFor={field.name}
                    className={fieldLabelClassName}
                  >
                    Phone number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={inputClassName}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Roles Card */}
      <Card className={cardClassName}>
        <CardHeader className="p-0 pb-1">
          <CardTitle className={cardTitleClassName}>Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) => validateField("role", value),
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={hasError || undefined}>
                  <FieldLabel htmlFor="role" className={fieldLabelClassName}>
                    Select role
                  </FieldLabel>
                  <Select
                    value={field.state.value || ""}
                    onValueChange={(val) => field.handleChange(val ?? "")}
                  >
                    <SelectTrigger
                      id="role"
                      aria-invalid={hasError || undefined}
                      className="w-full h-9 rounded-md border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm shadow-none"
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasError && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="designation">
            {(field) => (
              <Field>
                <FieldLabel
                  htmlFor={field.name}
                  className={fieldLabelClassName}
                > 
                  Designation
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Outlet manager"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={inputClassName}
                />
              </Field>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Profile image Card */}
      <Card className={cardClassName}>
        <CardHeader className="p-0 pb-1">
          <CardTitle className={cardTitleClassName}>Profile image</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />

          {previewUrl ? (
            <div className="relative flex items-center justify-between p-3.5 border border-neutral-200/90 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 shadow-2xs"
                />
                <div>
                  <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    {form.getFieldValue("profileImage")?.name || "Uploaded image"}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {form.getFieldValue("profileImage")?.size
                      ? `${(form.getFieldValue("profileImage").size / 1024).toFixed(1)} KB`
                      : "Image attached"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveImage}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileChange(file);
              }}
              className={`border-2 border-dashed rounded-xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${isDragging
                  ? "border-[#F65F42] bg-[#F65F42]/5"
                  : "border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50"
                }`}
            >
              <div className="w-11 h-11 rounded-full bg-[#F65F42]/10 flex items-center justify-center text-[#F65F42]">
                <FolderUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Click or drag file to this area to upload
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Support only single file
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security info Card */}
      <Card className={cardClassName}>
        <CardHeader className="p-0 pb-1">
          <CardTitle className={cardTitleClassName}>Security info</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => validateField("password", value),
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={hasError || undefined}>
                    <FieldLabel
                      htmlFor={field.name}
                      className={fieldLabelClassName}
                    >
                      Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={hasError || undefined}
                      className={inputClassName}
                    />
                    {hasError && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value, fieldApi }) =>
                  validateField("confirmPassword", value, {
                    password: fieldApi.form.getFieldValue("password"),
                  }),
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={hasError || undefined}>
                    <FieldLabel
                      htmlFor={field.name}
                      className={fieldLabelClassName}
                    >
                      Confirm password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={hasError || undefined}
                      className={inputClassName}
                    />
                    {hasError && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-9 px-4 text-sm font-normal text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 px-4.5 bg-[#F65F42] hover:bg-[#e55337] text-white !text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-white !text-white" />
          <span className="text-white !text-white">Save</span>
        </Button>
      </div>
    </form>
  );
}

export function UserDrawer({
  open,
  onOpenChange,
  trigger,
  onSuccess,
}) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection="right"
    >
      {trigger}
      <DrawerContent className="sm:[--drawer-content-width:34rem] md:[--drawer-content-width:40rem] flex flex-col h-full max-h-screen">
        <DrawerHeader className="px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <DrawerTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Create User
            </DrawerTitle>
            <DrawerDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Fill in the user details below to create a new user account.
            </DrawerDescription>
          </div>
          <DrawerClose className="rounded-md p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <UserForm
            onSubmit={async (values) => {
              await onSuccess?.(values);
              onOpenChange?.(false);
            }}
            onCancel={() => onOpenChange?.(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default UserForm;

