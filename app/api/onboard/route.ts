import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomerOnboardingAPISchema } from "@/schemas"; 
import { currentUser } from "@/lib/auth"; 
import { Prisma } from "@/lib/generated/prisma/client";
import { runOcrOnImage, parseIdAndNameFromText } from "@/lib/ocr"; 
import { generateEmailOtp } from "@/lib/emailOtp"; 
import { sendEmailOtp } from "@/lib/email";


/**
 * POST /api/onboard
 * Handles customer creation, OCR validation, and initial email OTP delivery.
 */
export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            // In a Next.js environment, redirect or return 401
            return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
        }
        const CREATED_BY_USER_ID = user.id || "";

        const body = await req.json();

        // 1. Validate the incoming body against the Zod schema
        const validationResult = CustomerOnboardingAPISchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({
                message: "Validation failed.",
                errors: validationResult.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const data = validationResult.data;

        
        const profileImageUrl = data.profileImageUrl;
        const idFrontImageUrl = data.idFrontImageUrl;
        const idBackImageUrl = data.idBackImageUrl;


        // 2. OCR Validation
        let candidateId: string | null = null;
        let candidateName: string | null = null;
        let ocrText: string | null = null;

        try {
            ocrText = await runOcrOnImage(idFrontImageUrl);
            const ocrResult = parseIdAndNameFromText(ocrText);
            candidateId = ocrResult.candidateId;
            candidateName = ocrResult.candidateName;
        } catch (ocrError) {
            console.error("[API/ONBOARD] OCR processing failed:", ocrError);
            // Non-critical failure: We log the error but proceed with PENDING status
        }

        // Compare OCR results with submitted form data (CRITICAL CHECK)
        if (candidateId && candidateId !== data.nationalId) {
            return NextResponse.json(
                { message: "OCR validation failed: National ID does not match ID document." },
                { status: 400 }
            );
        }

        const fullName = `${data.firstName} ${data.lastName}`;
        if (candidateName && !candidateName.toLowerCase().includes(fullName.toLowerCase())) {
            return NextResponse.json(
                { message: "OCR validation failed: Name does not closely match ID document." },
                { status: 400 }
            );
        }


        // 3. Create records in a transaction
        const transactionResult = await prisma.$transaction(async (tx) => {
            // Create Image records (use [0] from the array)
            const profileImg = await tx.image.create({ data: { url: profileImageUrl[0] } });
            const frontImg = await tx.image.create({ data: { url: idFrontImageUrl[0] } });
            const backImg = await tx.image.create({ data: { url: idBackImageUrl[0] } });

            // Create the Customer record with PENDING status (default)
            const customer = await tx.customer.create({
                data: {
                    firstName: data.firstName,
                    middleName: data.middleName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    nationalId: data.nationalId,
                    profileImageId: profileImg.id,
                    idFrontImageId: frontImg.id,
                    idBackImageId: backImg.id,
                    nationality: data.nationality,
                    address: data.address,
                    businessName: data.businessName,
                    businessType: data.businessType,
                    createdById: CREATED_BY_USER_ID,
                    ocrExtractedName: candidateName,
                    ocrExtractedId: candidateId,
                    // status is PENDING by default
                },
            });
            return customer;
        });

        const customerEmail = transactionResult.email;
        const customerName = transactionResult.firstName;

        // 4. Generate and Store OTP
        const { otp, hash, expiresAt } = generateEmailOtp();

        await prisma.customer.update({
            where: { id: transactionResult.id },
            data: {
                // IMPORTANT: Use the correct field names from the Customer model
                emailOtpHash: hash, 
                emailOtpExpiry: expiresAt,
                // Increment attempts (optional, but good practice)
                emailOtpAttempts: 0, 
            },
        });

        // 5. Send OTP Email
        try {
            await sendEmailOtp(customerEmail, otp, customerName);
        } catch (emailError) {
            console.error("[API/ONBOARD] Failed to send OTP email:", emailError);
            // This is a soft failure. We still return 201 but log the error.
        }


        // 6. Success Response (Customer is PENDING)
        return NextResponse.json({
            message: "Customer created successfully. OTP sent for email verification.",
            customerId: transactionResult.id,
            status: transactionResult.status,
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("[API/ONBOARD] Error during customer creation:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { message: "A customer with this National ID or email already exists." },
                    { status: 409 }
                );
            }
        }

        const msg = error instanceof Error ? error.message : "Internal server error.";
        return NextResponse.json({ message: "Internal server error.", error: msg }, { status: 500 });
    }
}