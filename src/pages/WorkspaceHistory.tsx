// pages/WorkspaceHistory.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Loader2 } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

// Import your centralized custom hook layer
import { useWorkspaceHistory } from "../hooks/history_hooks/useWorkspaceHistory";

// Import your newly built sub-components
import HistoryHeader from "../components/history_components/HistoryHeader";
import HistoryCard from "../components/history_components/HistoryCard";
import HistoryDetailsModal from "../components/history_components/HistoryDetailsModal";

// High-fidelity type contract directly from our brain layers
import type { WorkspaceHistoryItem } from "../context/AuthContext";

export default function WorkspaceHistory() {
  const { historyLogs, isHistoryLoading, changeRange } = useWorkspaceHistory();

  // Track state management for active modals and inspection nodes
  const [activeRange, setActiveRange] = useState<string>("7days");
  const [selectedLog, setSelectedLog] = useState<WorkspaceHistoryItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Router handler to update query parameters on click
  const handleRangeToggle = (rangeId: string) => {
    setActiveRange(rangeId);
    changeRange(rangeId);
  };

  const handleOpenInspector = (log: WorkspaceHistoryItem) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
        {/* Top Header & Filter Action Shell */}
        <HistoryHeader
          activeRange={activeRange}
          onRangeChange={handleRangeToggle}
        />

        {/* Dynamic Display Grid Engine */}
        {isHistoryLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              Compiling database records...
            </p>
          </div>
        ) : historyLogs.length === 0 ? (
          /* Empty State Node */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl py-16 px-4 flex flex-col items-center justify-center text-center bg-zinc-50/30 dark:bg-zinc-900/10"
          >
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-2xl mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              No History Logs Found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-xs mt-1 leading-relaxed">
              We couldn't resolve any presence logs or metric markers for the
              chosen timeframe parameter.
            </p>
          </motion.div>
        ) : (
          /* Main Chronological Stack Feed */
          <div className="w-full space-y-3">
            {historyLogs.map((log) => (
              <HistoryCard
                key={log.id}
                log={log}
                onInspectClick={handleOpenInspector}
              />
            ))}
          </div>
        )}
      </div>

      {/* Persistent Single Inspector Overlay Component Overlay Node */}
      <HistoryDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </DashboardLayout>
  );
}
