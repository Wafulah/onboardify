import React from "react";

import { notFound } from "next/navigation";
import CompleteScreen from "../components/CompleteScreen";


import prisma from "@/lib/prisma";

type Props = {
  params: { customerId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};



export default async function SuccessPage({ params, searchParams }: Props) {
  const { customerId } = params;
  const statusParam = Array.isArray(searchParams?.status) ? searchParams?.status[0] : searchParams?.status;

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
