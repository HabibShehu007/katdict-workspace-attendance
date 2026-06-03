// hooks/useWorkspaceHistory.ts
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

export function useWorkspaceHistory() {
  const { historyLogs, isHistoryLoading, fetchHistory } = useAuth();

  // Track what filter view the user has selected (e.g., 'all_week', 'Mon', 'Tue', 'custom')
  const [activeFilter, setActiveFilter] = useState<string>("all_week");

  // Track custom date strings when they fall back to using the calendar component
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  // 1. Core Initialization: Grab everything matching the present week immediately on mount
  useEffect(() => {
    fetchHistory("current_week");
  }, [fetchHistory]);

  /**
   * ⚡ HIGH-SPEED MEMORY EVALUATION ENGINE
   * Instead of waiting for a network request, this dynamically computes your
   * viewing rows instantly from memory based on the selected weekday toggle!
   */
  const filteredLogs = useMemo(() => {
    if (activeFilter === "all_week" || activeFilter === "custom") {
      return historyLogs;
    }

    // Filter matching weekdays from context state (e.g., 'Monday', 'Tuesday')
    return historyLogs.filter(
      (log) => log.day_name.trim().toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [activeFilter, historyLogs]);

  // 2. Navigation Actions Controller Router
  const applyFilter = (
    filterId: string,
    customStart?: string,
    customEnd?: string,
  ) => {
    setActiveFilter(filterId);

    if (filterId === "custom" && customStart && customEnd) {
      setCustomDateRange({ startDate: customStart, endDate: customEnd });
      // Only hit the database when looking up past dates via the calendar!
      fetchHistory("custom", customStart, customEnd);
    } else if (filterId === "all_week") {
      setCustomDateRange(null);
      // Re-hydrate current week records instantly if they reset filters
      fetchHistory("current_week");
    }
  };

  return {
    historyLogs: filteredLogs, // Returns the instantly sliced memory list to the UI
    isHistoryLoading,
    activeFilter,
    customDateRange,
    changeFilter: applyFilter,
  };
}
