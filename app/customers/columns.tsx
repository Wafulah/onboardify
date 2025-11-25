"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, User, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { AccountStatus } from "@/lib/generated/prisma/client"; 
import { cn } from "@/lib/utils"

export type CustomerColumn = {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
  status: AccountStatus; 
  createdBy: string; 
  createdAt: string; 
};


export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <User className="mr-2 h-4 w-4" />
        Customer Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.fullName}</span>,
  },
  {
    accessorKey: "nationalId",
    header: "National ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
      const status = row.original.status;
      const baseClasses = "px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1";
      
      let statusIcon;
      let statusClasses;

      switch (status) {
        case AccountStatus.VERIFIED:
          statusIcon = <CheckCircle className="h-3 w-3" />;
          statusClasses = "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
          break;
        case AccountStatus.REJECTED:
          statusIcon = <XCircle className="h-3 w-3" />;
          statusClasses = "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
          break;
        case AccountStatus.FLAGGED:
          statusIcon = <Eye className="h-3 w-3" />; // Using Eye for attention/flagged
          statusClasses = "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
          break;
        case AccountStatus.PENDING:
        default:
          statusIcon = <Clock className="h-3 w-3 animate-spin" />;
          statusClasses = "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
          break;
      }

      return (
        <span className={cn(baseClasses, statusClasses)}>
          {statusIcon}
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Agent",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.createdBy}</span>
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            {/* Link to a detail page for viewing and verification */}
            <Link href={`/dashboard/customers/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" /> View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];