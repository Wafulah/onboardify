import React from "react";

import { notFound } from "next/navigation";
import CompleteScreen from "../components/CompleteScreen";


import prisma from "@/lib/prisma";

type Props = {
  params:  Promise<{ customerId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};



export default async function SuccessPage({ params, searchParams }: Props) {
  const { customerId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const statusParam = Array.isArray(resolvedSearchParams?.status) ? resolvedSearchParams?.status[0] : resolvedSearchParams?.status;


  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { firstName: true, lastName: true, email: true, status: true },
  });

  if (!customer) notFound();

  const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer";
  const finalStatus = statusParam ?? customer.status ?? "VERIFIED";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <CompleteScreen customerName={customerName} finalStatus={String(finalStatus)} />
    </div>
  );
}
