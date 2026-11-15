import { z } from "zod";

const toTrimmedString = (requiredMsg) =>
  z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, requiredMsg)
  );

export const tenantFormSchema = z.object({
  name: toTrimmedString("Restaurant name is required").pipe(
    z
      .string()
      .min(2, "Restaurant name must be between 2 and 100 characters")
      .max(100, "Restaurant name must be between 2 and 100 characters")
  ),
  address: toTrimmedString("Restaurant address is required").pipe(
    z
      .string()
      .min(2, "Restaurant address must be between 2 and 255 characters")
      .max(255, "Restaurant address must be between 2 and 255 characters")
  ),
});

/**
 * Validates a single field against the tenant schema.
 */
export const validateTenantField = (fieldName, value) => {
  const fieldSchema = tenantFormSchema.shape[fieldName];
  if (!fieldSchema) return undefined;

  const result = fieldSchema.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message;
  }
  return undefined;
};

/**
 * Validates the full tenant form on submission.
 */
export const validateTenantForm = (values) => {
  const result = tenantFormSchema.safeParse(values);
  if (result.success) return undefined;

  const fields = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field && !fields[field]) {
      fields[field] = issue.message;
    }
  }
  return { fields };
};
