import "./globals.css";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";
import { IconDashboard, IconFileDescription, IconSettings, IconUserPlus, IconUsers } from "@tabler/icons-react"; 


const links = [
  {
    label: "Home",
    href: "/",
    icon: <IconDashboard className="h-5 w-5 text-blue-700 dark:text-neutral-400" />,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <IconFileDescription className="h-5 w-5 text-blue-700 dark:text-neutral-400" />,
  },
   {
    label: "Onboard",
    href: "/onboard",
    icon: <IconUserPlus className="h-5 w-5 text-blue-700 dark:text-neutral-400" />,
  },
   {
    label: "Customers",
    href: "/customers",
    icon: <IconFileDescription className="h-5 w-5 text-blue-700 dark:text-neutral-400" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <IconSettings className="h-5 w-5 text-blue-700 dark:text-neutral-400" />,
  },
];


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
     
      <body className="h-full">
    
        <Sidebar>
       
          <div className="flex flex-col h-screen">
            
            <Navbar /> 
            
          
            <div className="flex flex-1 overflow-hidden">
              
             
              <SidebarBody>
                
                <div className="flex flex-col gap-2 flex-1">
                  {links.map((link) => (
                    <SidebarLink key={link.href} link={link} />
                  ))}
                </div>
               
              </SidebarBody>
              
           
              <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>

            </div>
          </div>
        </Sidebar>
      </body>
    </html>
  );
}