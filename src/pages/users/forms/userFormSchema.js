import { z } from "zod";

const toString = (val) =>
  val === null || val === undefined ? "" : String(val);

const toTrimmedString = (requiredMessage) =>
  z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val).trim()),
    z.string().min(1, requiredMessage)
  );

export const userFormBaseSchema = z.object({
  firstName: toTrimmedString("First name is required").pipe(
    z
      .string()
      .min(2, "First name must be between 2 and 50 characters")
      .max(50, "First name must be between 2 and 50 characters")
  ),
  lastName: toTrimmedString("Last name is required").pipe(
    z
      .string()
      .min(2, "Last name must be between 2 and 50 characters")
      .max(50, "Last name must be between 2 and 50 characters")
  ),
  email: toTrimmedString("Email is required").pipe(
    z.string().email("Invalid email address")
  ),
  role: toTrimmedString("Please select a role"),
  password: z.preprocess(
    toString,
    z
      .string()
      .min(1, "Password is required")
      .min(8, "Password should be at least 8 characters")
  ),
  confirmPassword: z.preprocess(
    toString,
    z.string().min(1, "Confirm password is required")
  ),
});

export const userFormSchema = userFormBaseSchema.superRefine((data, ctx) => {
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});

export const validateField = (fieldName, value, formValues) => {
  if (fieldName === "confirmPassword") {
    const password = formValues?.password;
    if (!value) return "Confirm password is required";
    if (password && value !== password) {
      return "Passwords do not match";
    }
    return undefined;
  }

  const fieldSchema = userFormBaseSchema.shape[fieldName];
  if (!fieldSchema) return undefined;

  const result = fieldSchema.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message;
  }
  return undefined;
};

/**
 * Validates the full form against the centralized schema on submit.
 */
export const validateUserForm = (values) => {
  const result = userFormSchema.safeParse(values);
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
