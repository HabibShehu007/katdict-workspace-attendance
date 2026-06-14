// hooks/history_hooks/useWorkspaceHistory.ts
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

export function useWorkspaceHistory() {
  const { historyLogs, isHistoryLoading, fetchHistory } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string>("all_week");

  // Ref to persist logs for rapid UI switching without re-fetching
  const currentWeekCache = useRef<WorkspaceHistoryItem[]>([]);
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    if (historyLogs.length > 0) {
      currentWeekCache.current = historyLogs;
      setIsInitialLoaded(true);
    } else if (!isHistoryLoading && !isInitialLoaded) {
      fetchHistory("current_week").then(() => setIsInitialLoaded(true));
    }
  }, [historyLogs, isHistoryLoading, fetchHistory, isInitialLoaded]);

  // High-Speed Instant filtering
  const filteredLogs = useMemo(() => {
    if (activeFilter === "all_week" || activeFilter === "custom") {
      return historyLogs;
    }

    const baseLogs =
      currentWeekCache.current.length > 0
        ? currentWeekCache.current
        : historyLogs;

    const filter = activeFilter.toLowerCase();

    // Normalized filtering: Matches dayName defined in your AuthContext types
    return baseLogs.filter((log) => {
      const day = log.dayName?.toLowerCase() || "";
      return day === filter || day.startsWith(filter);
    });
  }, [activeFilter, historyLogs]);

  const applyFilter = (
    filterId: string,
    customStart?: string,
    customEnd?: string,
  ) => {
    setActiveFilter(filterId);

    if (filterId === "custom" && customStart && customEnd) {
      fetchHistory("custom", customStart, customEnd);
    } else if (
      filterId === "all_week" &&
      currentWeekCache.current.length === 0
    ) {
      fetchHistory("current_week");
    }
  };

  return {
    historyLogs: filteredLogs,
    isHistoryLoading:
      activeFilter === "custom"
        ? isHistoryLoading
        : !isInitialLoaded && isHistoryLoading,
    activeFilter,
    changeFilter: applyFilter,
  };
}
