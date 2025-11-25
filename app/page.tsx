import React from 'react';

import { UserPlus, Users, AlertTriangle, ListChecks } from 'lucide-react';
import { currentUser } from "@/lib/auth";
import { redirect } from 'next/navigation';




const Button: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean, variant?: 'primary' | 'outline' }> = ({ children, className, variant = 'primary', ...props }) => {
   
    const baseClasses = "rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 h-12 px-6 shadow-md min-w-[150px] md:min-w-[240px]";
    const primaryClasses = "bg-blue-800 text-white hover:bg-blue-900 shadow-xl shadow-blue-700/30 hover:scale-[1.02]";
    const outlineClasses = "bg-transparent border border-blue-800 text-blue-800 hover:bg-blue-50 dark:hover:bg-neutral-800 hover:scale-[1.02]";
 
    const finalClasses = `${baseClasses} ${variant === 'primary' ? primaryClasses : outlineClasses} ${className || ''}`;


    return <a className={finalClasses} {...props}>{children}</a>;
};




export default async function Home() {
       
    const user = await currentUser(); 
    
    if (!user) {
      redirect("/login"); 
    }

    const keyMetrics = [
        { label: "New Cases (Last 24h)", value: "18", icon: UserPlus, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Pending Approvals", value: "3", icon: ListChecks, color: "text-amber-600", bg: "bg-amber-100" },
        { label: "High Risk Flags", value: "1", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
        { label: "Total Customers", value: "8,452", icon: Users, color: "text-green-600", bg: "bg-green-100" },
    ];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl p-6 md:p-10 border border-neutral-200 dark:border-neutral-700">
            
            {/* User Welcome & Info */}
            <header className="mb-8 border-b pb-4 border-neutral-200 dark:border-neutral-700">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                    Welcome, {user.name}
                </h1>
                <p className="text-xl text-blue-800 dark:text-blue-300 font-medium">
                    {user.role} | NCBA KYC Platform
                </p>
            </header>

            {/* Key Metrics Overview */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Compliance Snapshot</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {keyMetrics.map((metric) => (
                        <div 
                            key={metric.label} 
                            className="p-4 rounded-xl shadow-lg transition-all hover:shadow-xl dark:bg-neutral-800 flex flex-col items-start"
                            style={{ backgroundColor: metric.bg.replace('bg-', '#') }}
                        >
                            <div className={`p-2 rounded-full mb-3 ${metric.bg}`}>
                                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {metric.value}
                            </p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {metric.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Required Actions / Quick Links */}
            <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Required Actions</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                        href="/dashboard/onboard" 
                        variant="primary" 
                        className="w-full sm:w-auto"
                        title="Onboard User"
                    >
                        <UserPlus className="h-5 w-5" />
                        Onboard New User
                    </Button>
                    <Button 
                        href="/dashboard/customers" 
                        variant="outline" 
                        className="w-full sm:w-auto"
                        title="View Customers"
                    >
                        <Users className="h-5 w-5" />
                        View Customers (Audit)
                    </Button>
                </div>
            </div>
            
            <footer className="mt-8 pt-4 text-xs text-gray-400 dark:text-neutral-600 text-center border-t border-neutral-100 dark:border-neutral-800">
                Secure Banking Operations - NCBA Bank Compliance Portal
            </footer>
        </div>
    );
}