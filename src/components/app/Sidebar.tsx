import {
  LayoutDashboard,
  BarChart3,
  User,
  History,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LogoutModal } from "../modals/LogoutModal";

export default function Sidebar({
  onCloseMobile,
}: {
  onCloseMobile?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isWithinWorkspace } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "History", path: "/history", icon: History },
    { name: "Performance", path: "/performance", icon: BarChart3 },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="w-64 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-6 shadow-sm">
      <div className="flex-1 space-y-12">
        {/* Branding */}
        <div className="px-2">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            KATDICT
          </h1>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            Workspace Attendance System
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
                    layoutId="activeTab"
                    className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 w-5 h-5 transition-colors ${isActive ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`}
                />
                <span
                  className={`relative z-10 ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}
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
        <div
          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${isWithinWorkspace ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${isWithinWorkspace ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          {isWithinWorkspace ? "Location Verified" : "Out of Workspace"}
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 font-bold text-sm text-zinc-400 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
