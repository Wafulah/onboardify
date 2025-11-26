"use client";

import React from "react";
import { IconMenu2, IconUser, IconHome } from "@tabler/icons-react"; // Added IconHome for a default link
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar"; 
import { SignOut } from "@/components/auth/sign-out"; // Assume this component exists
import Link from "next/link";

export function Navbar({ className }: { className?: string }) {
  const { open, setOpen } = useSidebar();

  // Desktop Toggle Button (optional, but good for manual control)
  const toggleButton = (
    <button
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      onClick={() => setOpen(!open)}
      className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 hidden md:block" // Hidden on mobile
    >
      <IconMenu2 className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
    </button>
  );

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200 dark:bg-neutral-900/90 dark:border-neutral-700",
        "flex items-center justify-between h-16 px-4 md:px-8 shadow-sm",
        className || ""
      )}
    >
      <div className="flex items-center gap-4">
        {/* Desktop menu toggle (before the brand) */}
        {toggleButton} 
        
        {/* Mobile menu toggle (before the brand) */}
        <button
          aria-label={open ? "Close mobile menu" : "Open mobile menu"}
          onClick={() => setOpen(true)} // Toggles the mobile overlay ON
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

        
        <div className="w-auto">
          <SignOut />
        </div>
      </div>
    </nav>
  );
}