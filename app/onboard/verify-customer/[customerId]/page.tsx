import React from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";


import prisma from "@/lib/prisma";
import VerificationPageClient from "./components/VerificationPageClient";

type Props = {
  params:  Promise<{ customerId: string }>;
};


export default async function VerificationPage({ params }: Props) {
  const { customerId } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
    },
  });

  if (!customer) {
    
    notFound();
  }

  const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
     
      <VerificationPageClient
        customerId={customer.id}
        customerName={customerName}
        customerEmail={customer.email}
      />
    </div>
  );
}
