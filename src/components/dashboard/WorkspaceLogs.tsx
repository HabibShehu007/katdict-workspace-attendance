import { motion } from "framer-motion";
import { ClipboardX, Plus, CheckCircle2 } from "lucide-react";

interface WorkspaceLogsProps {
  dayName: string;
  hasAttendance: boolean;
  onAddAttendance: () => void;
}

export default function WorkspaceLogs({
  dayName,
  hasAttendance,
  onAddAttendance,
}: WorkspaceLogsProps) {
  if (!hasAttendance) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center p-12 sm:p-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors shadow-sm"
      >
        <div className="p-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-full mb-4">
          <ClipboardX className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          No active logs detected
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-2 mb-10 leading-relaxed">
          No attendance or active session logs for{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {dayName}
          </span>
          . Please register your workspace station presence below.
        </p>

        <button
          onClick={onAddAttendance}
          className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 cursor-pointer text-base"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span>Add Attendance</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl border-dashed"
    >
      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-3">
        <CheckCircle2 className="w-6 h-6" />
        <span className="font-black text-sm uppercase tracking-widest">
          Workspace Active
        </span>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Alhamdulillah! Your presence for{" "}
        <span className="font-bold">{dayName}</span> is verified. Ready to
        document your progress? We'll build out your logs entry modal next.
      </p>
    </motion.div>
  );
}
