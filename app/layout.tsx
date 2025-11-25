
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";
import { SidebarBody } from "@/components/ui/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar>
          <Navbar />
          <SidebarBody className="hidden md:block" />
          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
        </Sidebar>
      </body>
    </html>
  );
}
