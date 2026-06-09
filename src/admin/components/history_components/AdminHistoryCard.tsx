// components/admin_components/AdminHistoryCard.tsx
import { motion } from "framer-motion";
import { ChevronRight, FileText, Timer, MapPin, User } from "lucide-react";
import type { WorkspaceHistoryItem } from "../../../context/AuthContext";

// Define the type to include the joined user data
interface AdminHistoryCardProps {
  log: WorkspaceHistoryItem & { user_name?: string };
  onInspectClick: (log: any) => void;
}

export default function AdminHistoryCard({
  log,
  onInspectClick,
}: AdminHistoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs text-left"
    >
      <div className="space-y-2.5 flex-1 min-w-0">
        {/* Admin context: User Name Header */}
        {log.user_name && (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-1">
            <User className="w-3 h-3" />
            {log.user_name}
          </div>
        )}

        {/* Info badges and metadata row */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-black tracking-wider uppercase">
          <span className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
            {log.day_name}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500 font-bold">
            {log.formatted_date}
          </span>

          {/* Time Check Badge */}
          <span
            className={`inline-flex items-center gap-1 font-bold ${
              log.is_late
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <Timer className="w-3 h-3" />
            {log.is_late ? "Late" : "On Time"}
          </span>

          {/* Location Badge */}
          <span
            className={`inline-flex items-center gap-1 font-bold ${
              log.is_on_site
                ? "text-blue-600 dark:text-blue-400"
                : "text-purple-600 dark:text-purple-400"
            }`}
          >
            <MapPin className="w-3 h-3" />
            {log.is_on_site ? "On Site" : "Remote"}
          </span>
        </div>

        {/* Project Name and Task Description */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
            {log.is_log_empty ? (
              <span className="text-zinc-400 dark:text-zinc-500 font-normal italic">
                No work details submitted for this day.
              </span>
            ) : (
              log.project_title
            )}
          </h3>
          {!log.is_log_empty && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1 max-w-2xl leading-relaxed">
              {log.project_description}
            </p>
          )}
        </div>
      </div>

      {/* View Details Action Button */}
      <button
        onClick={() => onInspectClick(log)}
        className="flex items-center justify-center gap-1.5 text-xs font-black px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer active:scale-95 transition-all self-start sm:self-center shrink-0"
      >
        <FileText className="w-3.5 h-3.5 text-zinc-500" />
        <span>View Details</span>
        <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-zinc-400" />
      </button>
    </motion.div>
  );
}
