import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  FileClock,
  LogOut,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminLogoutModal } from "../components/modals/AdminLogoutModal";

export default function AdminSidebar({
  onCloseMobile,
}: {
  onCloseMobile?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      name: "Admin Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "System Logs", path: "/admin/history", icon: FileClock },
    { name: "Security Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    // Updated: White background for light mode, zinc-950 for dark
    <div className="w-64 h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-6 shadow-sm transition-colors duration-400">
      <div className="flex-1 space-y-12">
        {/* Admin Branding */}
        <div className="px-2">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            KATDICT
          </h1>
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
            Workspace Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onCloseMobile?.();
                }}
                className="relative w-full flex items-center gap-3 px-4 py-3 font-bold text-sm transition-all group"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabAdmin"
                    // Updated: Active state background adapts to theme
                    className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 w-5 h-5 transition-colors ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-500"
                      : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                  }`}
                />
                <span
                  className={`relative z-10 ${
                    isActive ? "text-zinc-900 dark:text-white" : "text-zinc-500"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        {/* Updated: Badge background adapts to theme */}
        <div className="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-500">
          <ShieldCheck className="w-3 h-3" />
          Admin Access
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 font-bold text-sm text-zinc-400 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      <AdminLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
