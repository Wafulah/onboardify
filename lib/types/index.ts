import { AccountStatus } from "@/lib/generated/prisma/client";

export interface CustomerOnboardingFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId: string;
    nationality: string;
    address: string;
    
    profileImageUrl: string[];
    idFrontImageUrl: string[];
    idBackImageUrl: string[];
}

export interface OnboardSuccessResponse {
    message: string;
    customerId: string;

    status: AccountStatus;
    customer: {
        id: string;
        firstName: string;        
        email: string; 
    };
}

export interface OtpVerificationFormProps {
    customerId: string;
    customerName: string;
    customerEmail: string; 
    onVerificationSuccess: (status: string) => void;
    onBack: () => void;
}