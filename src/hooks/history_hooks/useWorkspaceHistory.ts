// hooks/history_hooks/useWorkspaceHistory.ts
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

export function useWorkspaceHistory() {
  const { historyLogs, isHistoryLoading, fetchHistory } = useAuth();

  // Selected filter state view ('all_week', 'Mon', 'Tue', 'custom')
  const [activeFilter, setActiveFilter] = useState<string>("all_week");

  // Keep a safe local memory backup of the current week's logs
  const currentWeekCache = useRef<WorkspaceHistoryItem[]>([]);
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);

  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  // Optimized useEffect
  useEffect(() => {
    // Only fetch if we don't have data in the global state already
    if (historyLogs.length === 0) {
      fetchHistory("current_week").then(() => {
        setIsInitialLoaded(true);
      });
    } else {
      // If we already have data, just mark it as loaded
      setIsInitialLoaded(true);
    }
  }, [fetchHistory, historyLogs.length]); // Dependencies are now safer

  // Sync state context into our local fast memory cache only during standard week views
  useEffect(() => {
    if (activeFilter !== "custom" && historyLogs.length > 0) {
      currentWeekCache.current = historyLogs;
    }
  }, [historyLogs, activeFilter]);

  // High-Speed Instant filtering computed in memory
  const filteredLogs = useMemo(() => {
    // If custom view, read directly from whatever the context API fetched for us
    if (activeFilter === "custom") {
      return historyLogs;
    }

    // Use our lightning fast local cache for standard views
    const baseLogs =
      currentWeekCache.current.length > 0
        ? currentWeekCache.current
        : historyLogs;

    if (activeFilter === "all_week") {
      return baseLogs;
    }

    // Match exact short or full day characters (e.g. "Monday" or "Mon")
    return baseLogs.filter(
      (log) =>
        log.day_name.trim().toLowerCase() === activeFilter.toLowerCase() ||
        log.day_name
          .trim()
          .toLowerCase()
          .startsWith(activeFilter.toLowerCase()),
    );
  }, [activeFilter, historyLogs]);

  const applyFilter = (
    filterId: string,
    customStart?: string,
    customEnd?: string,
  ) => {
    setActiveFilter(filterId);

    if (filterId === "custom" && customStart && customEnd) {
      setCustomDateRange({ startDate: customStart, endDate: customEnd });
      // Request old files outside our state boundaries from server database
      fetchHistory("custom", customStart, customEnd);
    } else if (filterId === "all_week") {
      setCustomDateRange(null);
      // Read instantly from memory backup without sending network request again
      if (currentWeekCache.current.length === 0) {
        fetchHistory("current_week");
      }
    } else {
      setCustomDateRange(null);
    }
  };

  return {
    historyLogs: filteredLogs,
    // Hide loading screen entirely when transitioning using our memory cache
    isHistoryLoading:
      activeFilter === "custom"
        ? isHistoryLoading
        : !isInitialLoaded && isHistoryLoading,
    activeFilter,
    customDateRange,
    changeFilter: applyFilter,
  };
}
