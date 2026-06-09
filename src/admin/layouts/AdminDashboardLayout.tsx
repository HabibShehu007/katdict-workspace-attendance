import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../navigation/AdminSidebar";
import AdminMobileNav from "../navigation/AdminMobileNav";
import ThemeToggle from "../../components/app/ThemeToggle";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    // Updated: Uses bg-white for light and bg-zinc-950 for dark
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-400 ease-in-out">
      {/* Desktop Persistent Admin Sidebar */}
      {/* Updated: Border color adapts to theme */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0 border-r border-zinc-200 dark:border-zinc-800">
        <AdminSidebar />
      </div>

      {/* Mobile Top Header Display */}
      <AdminMobileNav isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />

      {/* Mobile Sidebar Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              // Updated: background and border are now theme-aware
              className="md:hidden fixed inset-y-0 left-0 w-64 z-50 shadow-2xl h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
            >
              <AdminSidebar onCloseMobile={() => setIsMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header: Updated background and border */}
        <header className="hidden md:flex w-full h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 items-center justify-end px-8 sticky top-0 z-30 transition-colors duration-400">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-500 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded">
              Admin Mode
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
