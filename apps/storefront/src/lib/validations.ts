import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});

// Quote schemas
export const quoteRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  service: z.string().min(1, "Service is required"),
  material: z.string().min(1, "Material is required"),
  quantity: z.coerce.number().int().positive("Quantity must be positive"),
  notes: z.string().max(2000).optional(),
  files: z
    .array(
      z.object({
        originalFilename: z.string(),
        s3Key: z.string(),
        s3Bucket: z.string().optional(),
        fileSize: z.number(),
        fileType: z.string(),
      })
    )
    .optional(),
});

// Payment schemas
export const createPaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      meshFileId: z.string().optional(),
    })
  ),
  shippingAddressId: z.string().optional(),
  billingAddressId: z.string().optional(),
  guestEmail: z.string().email().optional(),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// Address schemas
export const addressSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(10).max(20),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  isDefault: z.boolean().optional(),
});

// Profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Validation helper
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return {
      success: false,
      error: firstError?.message || "Validation failed",
    };
  }
  return { success: true, data: result.data };
}
