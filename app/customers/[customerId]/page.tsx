
import prisma from "@/lib/prisma"; 
import { Metadata } from "next";
import { Customer as CustomerModel, Image as ImageModel, User as UserModel, AccountStatus } from "@/lib/generated/prisma/client";
import { CustomerForm } from "./components/customer-form";
import { Heading } from "@/components/ui/dashboard/heading";

export const metadata: Metadata = {
  title: "Customer Details",
};


export type CustomerWithRelations = CustomerModel & {
  images: ImageModel[];
  createdBy: UserModel;
};

interface PageProps {
  params: Promise<{ customerId: string }>;
}



export default async function CustomerPage({ params }: PageProps) {
  const { customerId } = await params;

 
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      images: true, 
      createdBy: true, 
    },
  });

  if (!customer) {
    
    return (
      <div className="p-8 pt-6">
        <Heading title="Customer Not Found" description={`No customer record exists for ID: ${customerId}`} />
      </div>
    );
  }

 
  const initialData = customer as CustomerWithRelations;
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        
        <CustomerForm initialData={initialData} />
      </div>
    </div>
  );
}