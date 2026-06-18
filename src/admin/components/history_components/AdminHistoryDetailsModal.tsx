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
  Shield,
  Network,
  Server,
  Terminal,
} from "lucide-react";
import { type AdminLogItem } from "../../types/admin.types";

export interface AdminHistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  // Safely extract workData - API might return it as 'work_data' or 'workData'
  const workData = (log as any).work_data || (log as any).workData || {};

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
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {log.day_name || "Daily"} — {log.formatted_date}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                  <User className="w-3 h-3" /> {log.user_name}
                </div>
                <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase">
                  <Shield className="w-2.5 h-2.5" /> {log.user_role}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Time & Status Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sign-In
                </span>
                <span className="text-sm font-black mt-1 block">
                  {formatTime(log.arrival_time)}
                </span>
              </div>
              <div
                className={`p-3.5 border rounded-xl ${log.is_late ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}
              >
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  Status
                </span>
                <span
                  className={`text-xs font-black flex items-center gap-1 mt-1 ${log.is_late ? "text-amber-800" : "text-emerald-800"}`}
                >
                  {log.is_late ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {log.is_late ? "Late" : "On Time"}
                </span>
              </div>
            </div>

            {!log.is_log_empty ? (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">
                    Project Focus
                  </span>
                  <h2 className="text-sm font-bold">{log.project_title}</h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {log.project_description}
                  </p>
                </div>

                {/* Role-Specific Content */}
                {log.user_role === "web_development" && (
                  <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(workData.stacks || []).map((t: string) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {workData.githubUrl && (
                      <a
                        href={workData.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-emerald-600"
                      >
                        <GitBranch className="w-3.5 h-3.5" /> Repository
                      </a>
                    )}
                  </div>
                )}

                {log.user_role === "ui_ux_design" && (
                  <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Design Assets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(workData.stacks || []).map((t: string) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold px-2 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {workData.uiUrl && (
                      <a
                        href={workData.uiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-purple-600"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Figma Link
                      </a>
                    )}
                    {workData.liveUrl && (
                      <a
                        href={workData.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-zinc-600"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Asset Drive / Assets
                      </a>
                    )}
                  </div>
                )}

                {log.user_role === "networking" && (
                  <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Network className="w-3 h-3" /> Networking Details
                    </span>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(workData.stacks || []).map((t: string) => (
                          <span
                            key={t}
                            className="text-[10px] font-bold px-2 py-1 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 rounded-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {workData.infrastructureUrl && (
                        <a
                          href={workData.infrastructureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-xs font-bold text-sky-600"
                        >
                          <Server className="w-3.5 h-3.5" /> Infrastructure Map
                        </a>
                      )}
                      
                      {workData.automationUrl && (
                        <a
                          href={workData.automationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-xs font-bold text-zinc-600"
                        >
                          <Terminal className="w-3.5 h-3.5" /> Automation Scripts
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-xs text-zinc-400 italic">
                No details submitted.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

