import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Calendar,
  Layers,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  GitBranch,
  ExternalLink,
  User,
} from "lucide-react";
// Import your centralized type
import { type AdminLogItem } from "../../types/admin.types";

export interface AdminHistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Use the central type directly
  log: (AdminLogItem & { day_name?: string; formatted_date?: string }) | null;
}

export default function AdminHistoryDetailsModal({
  isOpen,
  onClose,
  log,
}: AdminHistoryDetailsModalProps) {
  if (!isOpen || !log) return null;

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return timeString;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden text-left z-10"
        >
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black tracking-wide uppercase">
                  {log.day_name || "Daily"} — Summary
                </span>
              </div>
              {log.user_name && (
                <div className="flex items-center gap-1.5 mt-1 text-emerald-600 dark:text-emerald-400">
                  <User className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {log.user_name}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400 rounded-lg cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Time and Status Section */}
            <div className="grid grid-cols-2 gap-3">
              {/* Sign-In Time Card */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-xl">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase block tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sign-In Time
                </span>
                <span className="text-sm font-black text-zinc-900 dark:text-white block mt-1">
                  {formatTime(log.arrival_time)}
                </span>
              </div>

              {/* Arrival Status Card */}
              <div
                className={`p-3.5 border rounded-xl flex flex-col justify-center ${
                  log.is_late
                    ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                    : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase block tracking-wider">
                  Arrival Status
                </span>
                <span
                  className={`text-xs font-black flex items-center gap-1 mt-1 ${
                    log.is_late
                      ? "text-amber-800 dark:text-amber-400"
                      : "text-emerald-800 dark:text-emerald-400"
                  }`}
                >
                  {log.is_late ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Late
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> On Time
                    </>
                  )}
                </span>
              </div>
            </div>

            {!log.is_log_empty ? (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Project Focus
                  </span>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                    {log.project_title}
                  </h2>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Work Description
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
                    {log.project_description}
                  </p>
                </div>

                {log.tech_stacks && log.tech_stacks.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> Technologies Used
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {log.tech_stacks.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-bold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Project Links
                  </span>
                  <div className="flex flex-col gap-2">
                    {log.github_url && (
                      <a
                        href={log.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
                      >
                        <GitBranch className="w-3.5 h-3.5 text-zinc-400" />{" "}
                        GitHub Repository
                      </a>
                    )}
                    {log.ui_reference_url && (
                      <a
                        href={log.ui_reference_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
                      >
                        <Layers className="w-3.5 h-3.5 text-zinc-400" /> UI
                        Reference Link
                      </a>
                    )}
                    {log.live_preview_url && (
                      <a
                        href={log.live_preview_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />{" "}
                        Live Production URL
                      </a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-xs text-zinc-400 py-4 italic">
                No work details submitted for this day.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
