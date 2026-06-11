import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Inbox, Loader2 } from "lucide-react";
import { Search } from "lucide-react";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import HistoryHeader from "../components/history_components/AdminHistoryHeader";
import HistoryCard from "../components/history_components/AdminHistoryCard";
import AdminHistoryDetailsModal from "../components/history_components/AdminHistoryDetailsModal";
import { useAdminHistory } from "../hooks/history_hooks/useAdminHistory";
import { type AdminLogItem } from "../types/admin.types";

export default function AdminHistory() {
  const [filter, setFilter] = useState("all_time");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>(
    {},
  );

  const { data: logs = [], isLoading } = useAdminHistory();

  const [selectedLog, setSelectedLog] = useState<AdminLogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to convert AdminLogItem to the format components expect
  const getLegacyCompatibleLog = (log: AdminLogItem) => ({
    ...log,
    day_name: new Date(log.log_date).toLocaleDateString("en-US", {
      weekday: "long",
    }),
    formatted_date: new Date(log.log_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });

  const historyLogs = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const getStartOfWeek = () => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - (day === 0 ? 6 : day - 1);
      const monday = new Date(today);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      return monday.getTime();
    };

    const mondayTime = getStartOfWeek();

    return logs.filter((log: AdminLogItem) => {
      const userName = log.user_name || "";
      const projectTitle = log.project_title || "";
      // 1. Search Logic
      const matchesSearch =
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        projectTitle.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Date/Filter Logic
      const logTime = new Date(log.log_date).getTime();
      let matchesDate = true;

      if (filter === "custom" && dateRange.start && dateRange.end) {
        matchesDate =
          log.log_date >= dateRange.start && log.log_date <= dateRange.end;
      } else if (filter === "this_week") {
        matchesDate = logTime >= mondayTime;
      } else if (["mon", "tue", "wed", "thu", "fri"].includes(filter)) {
        const dayMap: Record<string, number> = {
          mon: 1,
          tue: 2,
          wed: 3,
          thu: 4,
          fri: 5,
        };
        matchesDate = new Date(log.log_date).getDay() === dayMap[filter];
      }

      return matchesSearch && matchesDate;
    });
  }, [logs, filter, dateRange.start, dateRange.end, searchQuery]);

  return (
    <AdminDashboardLayout>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by user or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>
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

        {isLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              Syncing logs...
            </p>
          </div>
        ) : historyLogs.length === 0 ? (
          <motion.div className="w-full border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl py-16 px-4 flex flex-col items-center justify-center text-center bg-zinc-50/30 dark:bg-zinc-900/10">
            <Inbox className="w-10 h-10 text-zinc-400 mb-4" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              No history found
            </h3>
          </motion.div>
        ) : (
          <div className="w-full space-y-3">
            {historyLogs.map((log: AdminLogItem) => (
              <HistoryCard
                key={log.id}
                log={getLegacyCompatibleLog(log)}
                onInspectClick={(logData: any) => {
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
        log={selectedLog ? getLegacyCompatibleLog(selectedLog) : null}
      />
    </AdminDashboardLayout>
  );
}
