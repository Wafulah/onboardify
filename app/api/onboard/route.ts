import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomerOnboardingAPISchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma/client";



/**
 * POST /api/onboard
 * Handles the creation of a new customer and related KYC image records.
 */
export async function POST(req: NextRequest) {
    try {
         const user = await currentUser();
   
   
    if (!user) {
     
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const CREATED_BY_USER_ID = user.id || ""; 
    
  
        const body = await req.json();

        // 1. Validate the incoming body against the Zod schema
        const validationResult = CustomerOnboardingSchema.safeParse(body);
        
        if (!validationResult.success) {
            return NextResponse.json({ 
                message: "Validation failed.", 
                errors: validationResult.error.flatten().fieldErrors 
            }, { status: 400 });
        }

        const data = validationResult.data;

        // NOTE on Data Normalization:
        // The form sends single-item arrays for images (e.g., `idFrontImageUrl: ["url"]`).
        // We normalize them to single string URLs here for use with Prisma.

        const profileImageUrl = data.profileImageUrl[0];
        const idFrontImageUrl = data.idFrontImageUrl[0];
        const idBackImageUrl = data.idBackImageUrl[0];


        // 2. Multi-step creation in Prisma: Create Images first, then the Customer

        // 2a. Check if the creator user exists (required by Prisma schema)
        // In a real app, this check might be implicit via middleware.
        const creatorUser = await prisma.user.findUnique({ where: { id: CREATED_BY_USER_ID } });
        if (!creatorUser) {
            return NextResponse.json({ message: "Authenticated user not found." }, { status: 401 });
        }


        // 2b. Start a transaction to ensure all related records are created successfully
        const transactionResult = await prisma.$transaction(async (tx) => {
            
            // Create Image records and get their IDs
            const profileImg = await tx.image.create({ data: { url: profileImageUrl } });
            const frontImg = await tx.image.create({ data: { url: idFrontImageUrl } });
            const backImg = await tx.image.create({ data: { url: idBackImageUrl } });
            
            // Create the Customer record
            const customer = await tx.customer.create({
                data: {
                    // Step 1: Personal Info
                    firstName: data.firstName,
                    middleName: data.middleName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    
                    // Step 2: Identity & Image IDs
                    nationalId: data.nationalId,
                    profileImageId: profileImg.id, // Link image IDs
                    idFrontImageId: frontImg.id,
                    idBackImageId: backImg.id,

                    // Step 4: Background Info
                    nationality: data.nationality,
                    address: data.address,
                    businessName: data.businessName,
                    businessType: data.businessType,

                    // User Link
                    createdById: CREATED_BY_USER_ID,
                }
            });

            return customer;
        });


        // 3. Success Response
        return NextResponse.json({ 
            message: "Customer onboarded successfully.", 
            customer: transactionResult 
        }, { status: 201 });

    } catch (error: unknown) {
    console.error("[API/ONBOARD] Error during customer creation:", error);

    // Prisma known error (unique constraint, etc.)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "A customer with this National ID or email already exists." },
          { status: 409 }
        );
      }
      // handle other Prisma codes if needed
      return NextResponse.json({ message: "Database error.", code: error.code }, { status: 500 });
    }

    // Generic JS Error
    if (error instanceof Error) {
      return NextResponse.json({ message: "Internal server error.", error: error.message }, { status: 500 });
    }

    // Fallback for truly unknown errors
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}