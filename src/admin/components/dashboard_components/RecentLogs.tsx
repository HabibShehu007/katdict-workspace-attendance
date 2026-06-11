import { ArrowRight, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface RecentLog {
  id: number;
  project_title: string;
  arrival_time: string;
  user_name: string;
  user_role: string; // Added role field
}

interface RecentLogsProps {
  logs: RecentLog[];
}

const ROLE_MAP: Record<string, string> = {
  web_development: "Web Developer",
  ui_ux_design: "UI/UX Designer",
};

export default function RecentLogs({ logs }: RecentLogsProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
          Recent Logs
        </h3>
        <Link
          to="/admin/history"
          className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="group flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                {log.user_name.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {log.project_title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {log.user_name}
                  </p>
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    <Shield className="w-2 h-2" />
                    {ROLE_MAP[log.user_role] || "User"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {formatTime(log.arrival_time)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
