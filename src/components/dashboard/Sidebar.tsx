import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "History Logs", path: "/dashboard/history", icon: History },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully from workspace session.");
    navigate("/login");
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-6 transition-colors duration-400">
      <div className="space-y-8">
        {/* Branding Identity */}
        <div className="space-y-1">
          <h1 className="text-xl font-black tracking-wider text-zinc-900 dark:text-white uppercase">
            KATDICT <span className="text-emerald-500">WS</span>
          </h1>
          <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Workspace Engine v1.0
          </p>
        </div>

        {/* Navigation Portal Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Status Panel */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span className="truncate">Location Security Armed</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit Session</span>
        </button>
      </div>
    </div>
  );
}
