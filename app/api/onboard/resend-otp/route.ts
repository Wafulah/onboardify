import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateEmailOtp } from "@/lib/emailOtp";
import { sendEmailOtp } from "@/lib/email";

interface ResendOtpBody {
    customerId: string;
}

/**
 * POST /api/onboard/resend-otp
 * Generates a new OTP and sends it to the customer's email.
 */
export async function POST(req: NextRequest) {
    try {
        const body: ResendOtpBody = await req.json();
        const { customerId } = body;

        if (!customerId) {
            return NextResponse.json({ message: "Customer ID is required." }, { status: 400 });
        }

        // 1. Fetch customer data
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
        });

        if (!customer) {
            return NextResponse.json({ message: "Customer not found." }, { status: 404 });
        }

        if (customer.status === 'VERIFIED') {
            return NextResponse.json({ message: "Customer is already verified." }, { status: 400 });
        }

        // 2. Generate new OTP and expiry
        const { otp, hash, expiresAt } = generateEmailOtp();

        // 3. Update customer record with new OTP data
        await prisma.customer.update({
            where: { id: customerId },
            data: {
                emailOtpHash: hash,
                emailOtpExpiry: expiresAt,
                emailOtpAttempts: 0,
            },
        });

        await sendEmailOtp(customer.email, otp, customer.firstName);
        
        console.log(`[OTP Resend] New code generated and simulated send for ${customer.email}. Code: ${otp}`);

        return NextResponse.json({ 
            message: "A new verification code has been sent to your email."
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("[API/RESEND-OTP] Error:", error);
        const msg = error instanceof Error ? error.message : "Internal server error.";
        return NextResponse.json({ message: "Internal server error.", error: msg }, { status: 500 });
    }
}