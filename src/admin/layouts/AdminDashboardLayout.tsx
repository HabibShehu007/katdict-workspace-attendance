import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../navigation/AdminSidebar";
import AdminMobileNav from "../navigation/AdminMobileNav";
import ThemeToggle from "../../components/app/ThemeToggle";
// Updated import to point to the new Admin Context
import { useAdmin } from "../context/AdminContext";
import { getAdminTitle } from "../utils/adminHelpers";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Now using the unified Admin context hook
  const { admin, isLoading } = useAdmin();

  // 1. Handle Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="animate-pulse text-emerald-600 font-medium">
          Authenticating...
        </div>
      </div>
    );
  }

  // 2. Handle Unauthorized Access
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const adminTitle = getAdminTitle(admin.managed_role);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-400 ease-in-out">
      {/* Sidebar - Persistent on Desktop */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0 border-r border-zinc-200 dark:border-zinc-800">
        <AdminSidebar />
      </div>

      {/* Mobile Nav Toggle */}
      <AdminMobileNav isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />

      {/* Mobile Sidebar Overlay & Animation */}
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
              className="md:hidden fixed inset-y-0 left-0 w-64 z-50 shadow-2xl h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
            >
              <AdminSidebar onCloseMobile={() => setIsMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex w-full h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              {adminTitle || "Admin"}
            </span>
          </div>

          <div className="flex items-center gap-4">
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
