import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  BarChart3,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogoutModal } from "../modals/LogoutModal";

export default function Sidebar({
  onCloseMobile,
}: {
  onCloseMobile?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isWithinWorkspace } = useAuth(); // Removed 'user' as it was unused
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "History", path: "/history", icon: History },
    { name: "Performance", path: "/performance", icon: BarChart3 },
    { name: "My Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-6">
      <div className="space-y-8">
        {/* Branding */}
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase">
            KATDICT
          </h1>
          <p className="text-xs text-zinc-400">Workspace Engine</p>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        {/* Status Ribbon */}
        <div
          className={`px-3 py-2 rounded-lg text-xs font-bold ${
            isWithinWorkspace
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isWithinWorkspace ? "Workspace Verified" : "Remote Mode Active"}
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
