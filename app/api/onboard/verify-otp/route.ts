import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyEmailOtp } from "@/lib/emailOtp"; 
import { generateUniqueAccount } from "@/lib/account";
import { sendAccountMail } from "@/lib/sendAccountMail";


interface VerifyOtpBody {
    customerId: string;
    otp: string;
}

/**
 * POST /api/verify-otp
 * Verifies the customer-provided OTP and updates the customer status to VERIFIED.
 */
export async function POST(req: NextRequest) {
    try {
        const body: VerifyOtpBody = await req.json();
        const { customerId, otp } = body;

        if (!customerId || !otp) {
            return NextResponse.json({ message: "Customer ID and OTP are required." }, { status: 400 });
        }
        
        // 1. Fetch customer data
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: { 
                bankAccount: true 
            },
        });

        if (!customer) {
            return NextResponse.json({ message: "Customer not found." }, { status: 404 });
        }
        
        // 2. Check current status and attempt limit (optional but good practice)
        if (customer.status === 'VERIFIED') {
            return NextResponse.json({ message: "Customer is already verified." }, { status: 400 });
        }
        
        if (customer.emailOtpAttempts >= 5) { // Example limit
            return NextResponse.json({ message: "Too many failed attempts. Please contact support." }, { status: 429 });
        }

        // 3. Verify the OTP
        const result = verifyEmailOtp(otp, customer.emailOtpHash, customer.emailOtpExpiry);

        if (result === "valid") {
            // 4. Update customer status
            const newAccountNumber = await generateUniqueAccount();

            // B. Create the new Bank Account and link it to the customer, and update customer status
            const [bankAccount, updatedCustomer] = await prisma.$transaction([
                // Create the Bank Account
                prisma.bankAccount.create({
                    data: {
                        accountNumber: newAccountNumber,
                        balance: 0,
                        customerId: customerId,
                        accountType: 'CURRENT', 
                    }
                }),
                // Update Customer Status
                prisma.customer.update({
                    where: { id: customerId },
                    data: {
                        status: 'VERIFIED',
                        emailVerified: true,
                        
                        emailOtpHash: null,
                        emailOtpExpiry: null,
                        emailOtpAttempts: 0,
                    },
                })
            ]);

            // C. Send the welcome email with the account number
            await sendAccountMail(customer.email, newAccountNumber, customer.firstName);

            

            return NextResponse.json({ 
                message: "Email verification successful. Account status is now VERIFIED.", 
                status: updatedCustomer.status 
            }, { status: 200 });

        } else if (result === "expired") {
            // 5. Handle Expired/Invalid/Missing
            await prisma.customer.update({
                where: { id: customerId },
                data: { emailOtpAttempts: { increment: 1 } }
            });
            return NextResponse.json({ message: "Verification code expired. Please request a new code." }, { status: 400 });
        } else {
            // Invalid or Missing
            await prisma.customer.update({
                where: { id: customerId },
                data: { emailOtpAttempts: { increment: 1 } }
            });
            return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
        }

    } catch (error: unknown) {
        console.error("[API/VERIFY-OTP] Error:", error);
        const msg = error instanceof Error ? error.message : "Internal server error.";
        return NextResponse.json({ message: "Internal server error.", error: msg }, { status: 500 });
    }
}