import React from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";


import prisma from "@/lib/prisma";

type Props = {
  params: { customerId: string };
};

const VerificationClient = dynamic(
  () => import("./components/VerificationPageClient"),
  { ssr: false }
);

export default async function VerificationPage({ params }: Props) {
  const { customerId } = params;

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
     
      <VerificationClient
        customerId={customer.id}
        customerName={customerName}
        customerEmail={customer.email}
      />
    </div>
  );
}
