import React from 'react';

// --- Icon Definitions (For self-contained use) ---
const IconUserBolt = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 19c0 1.66-1.34 3-3 3s-3-1.34-3-3m0-7a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 17c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6zM17 10l3-3 3 3"/></svg>;
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 19h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-2"/><path d="M12 17c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6zM12 12a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 17c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6zM5 19h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H5"/></svg>;
const IconAlertTriangle = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const IconChecklist = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/><path d="M10 9l2 2 4-4"/><path d="M10 17l2 2 4-4"/></svg>;


// --- Placeholder Functions (Simulating Server Component Auth) ---
// Since we cannot resolve "@/auth/auth.node", we simulate the async server calls.
interface User {
    name: string;
    role: string;
}

const currentUser = async (): Promise<User> => {
    // Simulating a database fetch delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
        name: "Amina Mohammed",
        role: "Compliance Officer",
    };
};

// --- Custom Button Component (To replace the external import) ---
// FIX: Changed ButtonHTMLAttributes to AnchorHTMLAttributes since the component renders an <a> tag
const Button: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean, variant?: 'primary' | 'outline' }> = ({ children, className, variant = 'primary', ...props }) => {
    const baseClasses = "rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 h-12 px-6 shadow-md";
    const primaryClasses = "bg-blue-800 text-white hover:bg-blue-900 shadow-blue-500/50";
    const outlineClasses = "bg-transparent border border-blue-800 text-blue-800 hover:bg-blue-50 dark:hover:bg-neutral-800";
    
    // Ensure className is treated as string (it is handled internally by React for {...props})
    // and correctly append variant styles.
    const finalClasses = `${baseClasses} ${variant === 'primary' ? primaryClasses : outlineClasses} ${className || ''}`;

    // Assuming we use <a> tag as the default action for dashboard links
    return <a className={finalClasses} {...props}>{children}</a>;
};


// --- Main Server Component Dashboard ---

export default async function Home() {
    const user = await currentUser(); // Simulated data fetch

    const keyMetrics = [
        { label: "New Cases (Last 24h)", value: "18", icon: IconUserBolt, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Pending Approvals", value: "3", icon: IconChecklist, color: "text-amber-600", bg: "bg-amber-100" },
        { label: "High Risk Flags", value: "1", icon: IconAlertTriangle, color: "text-red-600", bg: "bg-red-100" },
        { label: "Total Customers", value: "8,452", icon: IconUsers, color: "text-green-600", bg: "bg-green-100" },
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
                        href="/onboard" 
                        variant="primary" 
                        className="w-full sm:w-auto"
                        title="Onboard User"
                    >
                        <IconUserBolt className="h-5 w-5" />
                        Onboard New User
                    </Button>
                    <Button 
                        href="/customers" 
                        variant="outline" 
                        className="w-full sm:w-auto"
                        title="View Customers"
                    >
                        <IconUsers className="h-5 w-5" />
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