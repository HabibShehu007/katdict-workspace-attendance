import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import ThemeToggle from "../ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-400 ease-in-out">
      {/* Desktop Persistent Sidebar Display */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Top Header Display */}
      <MobileNav isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
            />
            {/* Drawer Content Body */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-64 z-50 shadow-2xl h-full"
            >
              <Sidebar onCloseMobile={() => setIsMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Master Content Area Canvas container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Content Subheader Action Strip */}
        <header className="hidden md:flex w-full h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 items-center justify-end px-8 transition-colors duration-400 sticky top-0 z-30">
          <ThemeToggle />
        </header>

        {/* Dynamic Main Workspace Child Presentation Frame */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
