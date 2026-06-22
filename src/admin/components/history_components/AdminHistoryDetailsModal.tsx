import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { DevDetailView } from "../../../components/history_components/renderers/DevDetailView";
import { DesignDetailView } from "../../../components/history_components/renderers/DesignDetailView";
import { NetworkingDetailView } from "../../../components/history_components/renderers/NetworkingDetailView";
import { DataScienceDetailView } from "../../../components/history_components/renderers/DataScienceDetailView";

export interface AdminHistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: any | null;
}

export default function AdminHistoryDetailsModal({
  isOpen,
  onClose,
  log,
}: AdminHistoryDetailsModalProps) {
  if (!isOpen || !log) return null;

  // Unified data access helper
  const d = {
    userName: log.userName || log.user_name,
    userRole: log.userRole || log.user_role,
    arrivalTime: log.arrivalTime || log.arrival_time,
    isLate: log.isLate ?? log.is_late ?? false,
    projectTitle: log.projectTitle || log.project_title,
    projectDesc: log.projectDescription || log.project_description,
    workData: log.workData || log.work_data || {},
    dayName: log.dayName || log.day_name || "N/A",
    formattedDate: log.formattedDate || log.formatted_date || "N/A",
    isLogEmpty: log.isLogEmpty ?? log.is_log_empty ?? true,
  };

  const formatTime = (ts: string | Date) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderContent = () => {
    if (d.isLogEmpty)
      return (
        <p className="text-center text-xs text-zinc-400 italic py-4">
          No details submitted.
        </p>
      );
    switch (d.userRole) {
      case "web_development":
        return <DevDetailView data={d} />;
      case "ui_ux_design":
        return <DesignDetailView data={d} />;
      case "networking":
        return <NetworkingDetailView data={d} />;
      case "data_science":
        return <DataScienceDetailView data={d} />;
      default:
        return null;
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden text-left z-10"
        >
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {d.dayName} — {d.formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                  <User className="w-3 h-3" /> {d.userName}
                </div>
                <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase">
                  <Shield className="w-2.5 h-2.5" /> {d.userRole}
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

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sign-In
                </span>
                <span className="text-sm font-black mt-1 block">
                  {formatTime(d.arrivalTime)}
                </span>
              </div>
              <div
                className={`p-3.5 border rounded-xl ${d.isLate ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}
              >
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  Status
                </span>
                <span
                  className={`text-xs font-black flex items-center gap-1 mt-1 ${d.isLate ? "text-amber-800" : "text-emerald-800"}`}
                >
                  {d.isLate ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {d.isLate ? "Late" : "On Time"}
                </span>
              </div>
            </div>

            {!d.isLogEmpty && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Project Focus
                </span>
                <h2 className="text-sm font-bold">{d.projectTitle}</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {d.projectDesc}
                </p>
              </div>
            )}

            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
