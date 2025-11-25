// lib/validation/customer-schema.ts
import * as z from "zod";

// --- Custom Zod Schemas for each step ---

// Step 1: Personal Details
export const StepOneSchema = z.object({
  firstName: z.string().min(1, "First Name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required."),
  email: z.string().email("Must be a valid email.").min(1, "Email is required."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

// Step 2 & 3: ID & Document Uploads
export const StepTwoSchema = z.object({
  nationalId: z.string().min(6, "National ID must be at least 6 characters."),
  idFrontImageUrl: z.array(z.string()).length(1, "Front ID photo is required."),
  idBackImageUrl: z.array(z.string()).length(1, "Back ID photo is required."),
});

// Step 4: Customer Photo
export const StepThreeSchema = z.object({
  profileImageUrl: z.array(z.string()).length(1, "Customer profile photo is required."),
});

// Step 5: Contact & Background
export const StepFourSchema = z.object({
  address: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required."),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
});

// Combine all for the final form data type
export const CustomerOnboardingSchema = StepOneSchema.and(StepTwoSchema).and(StepThreeSchema).and(StepFourSchema);

export type CustomerOnboardingFormValues = z.infer<typeof CustomerOnboardingSchema>;