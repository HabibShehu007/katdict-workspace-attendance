import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Plus,
  Clock,
  ClipboardX,
  CheckCircle2,
} from "lucide-react";
// Import the layout shell we built
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Dashboard() {
  // 1. Dynamic Engine for Date Detection
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 2. State tracking whether attendance has been logged for today
  const [hasAttendance, setHasAttendance] = useState(false);

  // Temporary function to simulate a successful check-in
  const handleSimulateAttendance = () => {
    setHasAttendance(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* HEADER SECTION: Displays Calendar Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-colors shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                {dayName}
              </h2>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Quick System Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/40 text-xs font-bold font-mono text-zinc-600 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Session Tracker</span>
          </div>
        </div>

        {/* CONDITIONAL MAIN VIEWPORT */}
        {!hasAttendance ? (
          /* STATE A: No Attendance Logged for Today */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-12 sm:p-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors shadow-sm"
          >
            <div className="p-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-2xl mb-6">
              <ClipboardX className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
              No active logs detected
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-2 mb-10 leading-relaxed">
              It looks like you haven't checked in yet. No attendance or active
              session logs found for{" "}
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {dayName}
              </span>
              .
            </p>

            <button
              onClick={handleSimulateAttendance}
              className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 cursor-pointer text-base"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Add Attendance</span>
            </button>
          </motion.div>
        ) : (
          /* STATE B: Attendance Active (Placeholder for the actual log cards) */
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
              document your progress? We'll build the project log modal next.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
