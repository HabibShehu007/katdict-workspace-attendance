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
  // Pull the active filter state along with the optimized router trigger
  const { historyLogs, isHistoryLoading, activeFilter, changeFilter } =
    useWorkspaceHistory();

  // Track state management for the popups and log inspections
  const [selectedLog, setSelectedLog] = useState<WorkspaceHistoryItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle changes when the user switches tabs or selects custom calendar parameters
  const handleFilterToggle = (
    filterId: string,
    startDate?: string,
    endDate?: string,
  ) => {
    changeFilter(filterId, startDate, endDate);
  };

  const handleOpenInspector = (log: WorkspaceHistoryItem) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
        {/* Top header filter layout */}
        <HistoryHeader
          activeRange={activeFilter}
          onRangeChange={handleFilterToggle}
        />

        {/* Dynamic content rendering block */}
        {isHistoryLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              Loading your logs...
            </p>
          </div>
        ) : historyLogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl py-16 px-4 flex flex-col items-center justify-center text-center bg-zinc-50/30 dark:bg-zinc-900/10"
          >
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-2xl mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              No history found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-xs mt-1 leading-relaxed">
              We couldn't find any workspace submissions for the selected dates.
            </p>
          </motion.div>
        ) : (
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

      {/* Detail viewer popup modal */}
      <HistoryDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </DashboardLayout>
  );
}
