import { motion } from "framer-motion";
import { ClipboardX, Plus } from "lucide-react";

interface WorkspaceEmptyStateProps {
  dayName: string;
  onAddAttendanceClick: () => void;
}

export default function WorkspaceEmptyState({
  dayName,
  onAddAttendanceClick,
}: WorkspaceEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center justify-center text-center p-8 sm:p-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs"
    >
      <div className="p-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-full mb-5">
        <ClipboardX className="w-12 h-12" />
      </div>
      <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
        No active logs detected
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-2 mb-8 leading-relaxed font-medium">
        No attendance or active session logs recorded for{" "}
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {dayName}
        </span>
        . Register your presence now to lock in your score.
      </p>

      <button
        onClick={onAddAttendanceClick}
        className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer text-base tracking-wide"
      >
        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
        <span>Add Attendance</span>
      </button>
    </motion.div>
  );
}
