import { currentUser, currentRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/generated/prisma/client";
import { Prisma } from "@/lib/generated/prisma/client";

import { CustomersClient } from "./client";
import { CustomerColumn } from "./columns";
import { Separator } from "@/components/ui/separator";

const CustomerAccountsPage = async () => {
  const user = await currentUser();
  const role = await currentRole();

  // 1. Authentication Check
  if (!user) {
    redirect("/login");
  }

  // 2. Role Authorization Check
  if (role !== UserRole.SALES && role !== UserRole.ADMIN) {
    redirect("/unauthorized");
  }

  // 3. Build a typed where clause (avoid null/undefined being passed for createdById)
  const where: Prisma.CustomerWhereInput | undefined =
    role === UserRole.SALES && user?.id ? { createdById: user.id } : undefined;

  // 4. Data Fetching
  const customers = await prisma.customer.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
          dsaCode: true,
        },
      },
    },
    where,
    orderBy: { createdAt: "desc" },
  });

  // 5. Data Formatting (defensive access to createdBy)
  const formattedCustomers: CustomerColumn[] = customers.map((customer) => ({
    id: customer.id,
    fullName: `${customer.firstName} ${customer.lastName}`,
    nationalId: customer.nationalId,
    phone: customer.phone,
    email: customer.email,
    status: customer.status,
    createdBy:
      customer.createdBy?.name ??
      `Agent (${customer.createdBy?.dsaCode ?? "N/A"})`,
    createdAt: customer.createdAt.toISOString(),
  }));

  // 6. Render Client Component
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Customer Accounts</h1>
        <p className="text-muted-foreground">
          List of all opened and pending accounts.
        </p>
        <Separator className="mt-4" />
      </div>
      <CustomersClient data={formattedCustomers} />
    </div>
  );
};

export default CustomerAccountsPage;
