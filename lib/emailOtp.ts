import crypto from "crypto";

if (!process.env.EMAIL_SECRET) {
 throw new Error("EMAIL_SECRET is missing in environment variables");
}

const EMAIL_SECRET = process.env.EMAIL_SECRET;

/**
 * Generates a 6-digit OTP and its HMAC hash, along with the expiry time (10 minutes).
 * @returns {object} { otp, hash, expiresAt }
 */
export function generateEmailOtp() {
 const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
 const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

 // The data used for hashing must match the verification side
 const hash = crypto
 .createHmac("sha256", EMAIL_SECRET!)
 .update(`${otp}|${expiresAt.toISOString()}`)
 .digest("hex");

 return { otp, hash, expiresAt };
}

/**
 * Verifies a customer's provided OTP against the stored hash and expiry.
 * @param providedOtp The OTP submitted by the user.
 * @param storedHash The hash stored in the database.
 * @param storedExpiry The expiry date stored in the database.
 * @returns {"valid" | "expired" | "invalid" | "missing"} Verification result.
 */
export function verifyEmailOtp(
 providedOtp: string,
 storedHash: string | null,
 storedExpiry: Date | null
): "valid" | "expired" | "invalid" | "missing" {
 if (!storedHash || !storedExpiry) return "missing";
 
  // Check for expiry first
 if (new Date() > new Date(storedExpiry)) return "expired";

 // Recreate the expected hash using the provided OTP and the stored expiry
 const expected = crypto
 .createHmac("sha256", EMAIL_SECRET!)
 .update(`${providedOtp}|${new Date(storedExpiry).toISOString()}`)
 .digest("hex");

 return expected === storedHash ? "valid" : "invalid";
}