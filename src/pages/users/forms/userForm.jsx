import React, { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Save, X } from "lucide-react";

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
  const form = useForm({
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      role: initialValues?.role || "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: ({ value }) => validateUserForm(value),
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
  });

  return (
    <form
      data-testid="user-form"
      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                    Email
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="off"
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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
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
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (open) {
      setFormKey((prev) => prev + 1);
    }
  }, [open]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection="right"
    >
      {trigger}
      <DrawerContent className="data-[swipe-axis=x]:sm:[--drawer-content-width:30rem] data-[swipe-axis=x]:md:[--drawer-content-width:32rem] max-w-[95vw] flex flex-col h-full max-h-screen">
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
            key={formKey}
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

