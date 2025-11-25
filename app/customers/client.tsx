"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/ui/dashboard/data-table"; 
import { Heading } from "@/components/ui/dashboard/heading";
import { Separator } from "@/components/ui/dashboard/separator";

import { CustomerColumn, columns } from "./columns";

interface CustomerClientProps {
  data: CustomerColumn[];
}

export const CustomersClient: React.FC<CustomerClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Customer Accounts (${data.length})`} 
          description="View and manage all customer account opening requests." 
        />
        
        <Button onClick={() => router.push(`onboard`)}>
          <Plus className="mr-2 h-4 w-4" /> Open New Account
        </Button>
      </div>
      <Separator />
      {/* Search by Customer Name */}
      <DataTable searchKey="fullName" columns={columns} data={data} />
    </>
  );
};