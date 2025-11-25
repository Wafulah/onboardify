import React from 'react';
import { Navbar } from '@/components/Navbar'; 
import './globals.css'; 


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-50 dark:bg-neutral-950 min-h-screen antialiased">
              
                <Navbar /> 
                
              
                <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </body>
        </html>
    );
}