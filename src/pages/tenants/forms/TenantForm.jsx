import React from "react";
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
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  validateTenantField,
  validateTenantForm,
} from "./tenantFormSchema";

const cardClassName =
  "bg-white dark:bg-neutral-900 rounded-xl shadow-2xs border border-neutral-200/80 dark:border-neutral-800 p-5 gap-4";
const cardTitleClassName =
  "text-[15px] font-semibold text-neutral-900 dark:text-neutral-100";
const fieldLabelClassName =
  "text-xs font-medium text-neutral-600 dark:text-neutral-400";
const inputClassName =
  "h-9 rounded-md border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400";

export function TenantForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const form = useForm({
    defaultValues: {
      name: initialValues?.name || "",
      address: initialValues?.address || "",
    },
    validators: {
      onSubmit: ({ value }) => validateTenantForm(value),
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
  });

  return (
    <form
      data-testid="tenant-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <Card className={cardClassName}>
        <CardHeader className="p-0 pb-1">
          <CardTitle className={cardTitleClassName}>Restaurant details</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {/* Restaurant Name Field */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => validateTenantField("name", value),
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
                    Restaurant name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Grand Palace Hotel"
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

          {/* Address Field */}
          <form.Field
            name="address"
            validators={{
              onChange: ({ value }) => validateTenantField("address", value),
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
                    Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. 12 MG Road, Bengaluru"
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

export function TenantDrawer({
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
              Create Restaurant
            </DrawerTitle>
            <DrawerDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Fill in the details below to create a new restaurant.
            </DrawerDescription>
          </div>
          <DrawerClose className="rounded-md p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <TenantForm
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

export default TenantForm;
