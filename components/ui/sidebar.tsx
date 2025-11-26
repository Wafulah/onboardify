"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion"; 
import { IconMenu2, IconX } from "@tabler/icons-react";

// --- Interfaces ---

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

// --- Context ---

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// --- Provider ---

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  // Allow controlled or uncontrolled state
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// --- Main Sidebar Component ---

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

// --- Sidebar Body (Container for Desktop & Mobile) ---

export const SidebarBody = (props: MotionDivProps) => {
  return (
    <>

      <DesktopSidebar {...props} />
      
      <MobileSidebar {...props} />
    </>
  );
};

// --- Desktop Sidebar ---

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: MotionDivProps) => {
  const { open, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        // Default style for desktop: fixed height, background, hidden on mobile
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0 border-r border-neutral-200 dark:border-neutral-700",
        className
      )}
      // Framer Motion animation for width (collapse/expand)
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- Mobile Sidebar (Overlay/Drawer) ---

type MotionDivProps = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  children?: React.ReactNode;
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: MotionDivProps) => {
  const { open, setOpen } = useSidebar();
  
  // Renders nothing on desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 768) return null;

  
  return (
    <AnimatePresence>
      {open && (
        // Overlay for mobile view
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col",
            className
          )}
          {...props}
        >
         
          <div
            className="absolute right-4 top-4 z-50 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <IconX className="h-6 w-6" />
          </div>
          
          {children} 
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Individual Link Component ---

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors duration-150",
        className
      )}
      {...props}
    >
      {/* Icon is always visible */}
      {link.icon}

      {/* Label animates its visibility based on sidebar 'open' state */}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};