import { z } from "zod";

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
});

// Step 2: Address Details
export const addressSchema = z.object({
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  zipCode: z
    .string()
    .min(1, { message: "Zip code is required" })
    .min(5, { message: "Zip code must be at least 5 digits" })
    .regex(/^\d+$/, { message: "Zip code must contain only numbers" }),
});

// Step 3: Account Setup
export const accountSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .min(4, { message: "Username must be at least 4 characters" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Combined schema for the entire form
export const formSchema = z.object({
  personalInfo: personalInfoSchema,
  address: addressSchema,
  account: accountSchema,
});
