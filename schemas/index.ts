import * as z from "zod";

// --- Custom Zod Schemas for each step ---

// Step 1: Personal Details
export const StepOneSchema = z.object({
  firstName: z.string().min(1, "First Name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required."),
  email: z.string().email("Must be a valid email."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

// Step 2 & 3: ID & Document Uploads (FRONTEND VERSION)
export const StepTwoSchema = z.object({
  nationalId: z.string().min(6, "National ID must be at least 6 characters."),
  idFrontImageUrl: z.array(z.string()).length(1, "Front ID photo is required."),
  idBackImageUrl: z.array(z.string()).length(1, "Back ID photo is required."),
});

// Step 4: Customer Photo (FRONTEND VERSION)
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

// FRONTEND COMPLETE SCHEMA
export const CustomerOnboardingSchema = StepOneSchema
  .and(StepTwoSchema)
  .and(StepThreeSchema)
  .and(StepFourSchema);

export type CustomerOnboardingFormValues = z.infer<
  typeof CustomerOnboardingSchema
>;

// --- BACKEND API SCHEMA ---
// Accept strings instead of arrays (backend receives uploaded URLs)
export const CustomerOnboardingAPISchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),

  nationalId: z.string(),

  // backend expects string URLs
  idFrontImageUrl: z.string().url("Invalid ID Front URL."),
  idBackImageUrl: z.string().url("Invalid ID Back URL."),
  profileImageUrl: z.string().url("Invalid Profile Image URL."),

  address: z.string().optional(),
  nationality: z.string(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
});
