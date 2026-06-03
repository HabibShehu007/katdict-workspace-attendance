// components/history_components/HistoryDetailsModal.tsx
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
} from "lucide-react";
import type { WorkspaceHistoryItem } from "../../context/AuthContext";

interface HistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: WorkspaceHistoryItem | null;
}

export default function HistoryDetailsModal({
  isOpen,
  onClose,
  log,
}: HistoryDetailsModalProps) {
  if (!isOpen || !log) return null;

  // Helper to turn the timestamp into a clean HH:MM:SS format
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
      return timeString; // Fallback if the string is already formatted
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark blur background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden text-left z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-black tracking-wide uppercase">
                {log.day_name} — Summary
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400 rounded-lg cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Time and Status Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sign-In Time
                </span>
                <span className="text-sm font-black text-zinc-800 dark:text-zinc-200 block mt-0.5">
                  {formatTime(log.arrival_time)}
                </span>
              </div>

              <div
                className={`p-3.5 border rounded-xl flex flex-col justify-center ${
                  log.is_late
                    ? "bg-amber-50/40 border-amber-200/60 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/30"
                    : "bg-emerald-50/40 border-emerald-200/60 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/30"
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                  Arrival Status
                </span>
                <span className="text-xs font-black flex items-center gap-1 mt-0.5">
                  {log.is_late ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />{" "}
                      Late
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                      On Time
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Task Details */}
            {log.is_log_empty ? (
              <div className="p-4 border border-zinc-200 border-dashed rounded-xl text-center py-6">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium italic">
                  Attendance recorded, but no work tasks were submitted for this
                  day.
                </p>
              </div>
            ) : (
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
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
                    {log.project_description}
                  </p>
                </div>

                {/* Tech Stack List */}
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

                {/* Shared Project Links Section */}
                <div className="pt-2 space-y-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Project Links
                  </span>

                  <div className="flex flex-col gap-2">
                    {/* 1. Required GitHub Link Row */}
                    {log.github_url && (
                      <div>
                        <a
                          href={log.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          <GitBranch className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                          <span>GitHub Repository</span>
                        </a>
                      </div>
                    )}

                    {/* 2. UI Reference Link Row */}
                    {log.ui_reference_url && (
                      <div>
                        <a
                          href={log.ui_reference_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                          <span>UI Reference Link</span>
                        </a>
                      </div>
                    )}

                    {/* 3. Optional Live Preview Link Row */}
                    {log.live_preview_url && (
                      <div>
                        <a
                          href={log.live_preview_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                          <span>Live Production URL</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
