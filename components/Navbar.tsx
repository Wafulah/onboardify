
"use client";

import React from 'react';
import { IconMenu2, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils"; 

const Logo = () => (
    <div className="text-xl font-bold text-blue-800 dark:text-white">NCBA Compliance</div>
);

export function Navbar() {
    return (
        <nav className={cn(
            "sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200 dark:bg-neutral-900/90 dark:border-neutral-700",
            "flex items-center justify-between h-16 px-4 md:px-8 shadow-sm"
        )}>
            <div className="flex items-center gap-6">
                {/* Optional: Mobile Menu Toggle if needed */}
                <IconMenu2 className="h-6 w-6 text-neutral-600 dark:text-neutral-400 cursor-pointer md:hidden" />
                <Logo />
            </div>

            {/* Navigation Links/User Profile */}
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex text-sm text-neutral-600 dark:text-neutral-400">
                    Welcome, Compliance Officer
                </div>
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <IconUser className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
            </div>
        </nav>
    );
}