// src/admin/pages/AdminHistory.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Loader2 } from "lucide-react";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import HistoryHeader from "../components/history_components/AdminHistoryHeader";
import HistoryCard from "../components/history_components/AdminHistoryCard";
import AdminHistoryDetailsModal, {
  type AdminLogItem,
} from "../components/history_components/AdminHistoryDetailsModal";
import { useAdminHistory } from "../hooks/history_hooks/useAdminHistory";

export default function AdminHistory() {
  const [filter, setFilter] = useState("mon-fri");
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>(
    {},
  );

  const { data, isFetching } = useAdminHistory(
    filter,
    dateRange.start,
    dateRange.end,
  );

  const [selectedLog, setSelectedLog] = useState<AdminLogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const historyLogs = data?.logs || [];

  return (
    <AdminDashboardLayout>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
        <HistoryHeader
          activeRange={filter}
          customDateRange={
            filter === "custom"
              ? {
                  startDate: dateRange.start || "",
                  endDate: dateRange.end || "",
                }
              : undefined
          }
          onRangeChange={(range, start, end) => {
            setFilter(range);
            setDateRange({ start, end });
          }}
        />

        {/* Loading and Empty State Handling */}
        {isFetching && historyLogs.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              Loading logs...
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
              We couldn't find any workspace submissions for the selected
              filter.
            </p>
          </motion.div>
        ) : (
          <div className="w-full space-y-3">
            {historyLogs.map((log: AdminLogItem) => (
              <HistoryCard
                key={log.id}
                log={log}
                onInspectClick={(logData) => {
                  setSelectedLog(logData);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AdminHistoryDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />
    </AdminDashboardLayout>
  );
}
