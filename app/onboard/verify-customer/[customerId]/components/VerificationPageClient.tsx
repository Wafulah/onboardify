"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OtpVerificationForm from "./OtpVerificationForm";
import { AccountStatus } from "@/lib/generated/prisma/client";

interface Props {
  customerId: string;
  customerName: string;
  customerEmail: string;
}

export default function VerificationPageClient({ customerId, customerName, customerEmail }: Props) {
  const router = useRouter();

  const handleVerificationSuccess = (status: AccountStatus | string) => {
   
    router.push(`/onboard/verify-customer/${customerId}/success?status=${encodeURIComponent(String(status))}`);
  };

  const handleBack = () => {
    
    router.push("/onboarding");
  };

  return (
    <OtpVerificationForm
      customerId={customerId}
      customerName={customerName}
      customerEmail={customerEmail}
      onVerificationSuccess={handleVerificationSuccess}
      onBack={handleBack}
    />
  );
}
