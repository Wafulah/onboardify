"use client";

import React from "react";
import { IconMenu2, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar"; 
import { SignOut } from "@/components/auth/sign-out"; 
import Link from "next/link";

export function Navbar({ className }: { className?: string }) {
  
  const { open, setOpen } = useSidebar();

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200 dark:bg-neutral-900/90 dark:border-neutral-700",
        "flex items-center justify-between h-16 px-4 md:px-8 shadow-sm",
        className || ""
      )}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
        >
          <IconMenu2 className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
        </button>

      
        <Link href="/" className="text-xl font-bold text-blue-800 dark:text-white">
          NCBA Compliance
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex text-sm text-neutral-600 dark:text-neutral-400">
          Welcome, Compliance Officer
        </div>

        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
          <IconUser className="h-5 w-5 text-blue-700 dark:text-blue-300" />
        </div>

     
        <div className="hidden md:block w-36">
          <SignOut />
        </div>

     
        <div className="md:hidden">
          <SignOut />
        </div>
      </div>
    </nav>
  );
}
