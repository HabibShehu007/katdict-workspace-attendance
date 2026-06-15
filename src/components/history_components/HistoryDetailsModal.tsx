import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, Clock } from "lucide-react";
import { useLogRole } from "../../hooks/context_hooks/useLogRole";
import { DevDetailView } from "./renderers/DevDetailView";
import { DesignDetailView } from "./renderers/DesignDetailView";
import { NetworkingDetailView } from "./renderers/NetworkingDetailView"; // Import the new view
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
  const role = useLogRole(log);
  if (!isOpen || !log) return null;

  // Helper to render the correct view based on the role
  const renderDetailView = () => {
    switch (role) {
      case "dev":
        return <DevDetailView data={log} />;
      case "design":
        return <DesignDetailView data={log} />;
      case "networking":
        return <NetworkingDetailView data={log} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-zinc-500">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">
                {log.dayName}
              </span>
              <Clock className="w-4 h-4 ml-2" />
              <span className="text-xs font-medium tracking-wide">
                {log.logDate}
              </span>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
              {log.projectTitle}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
              {log.projectDescription}
            </p>

            {/* Dynamic Injector */}
            {renderDetailView()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
