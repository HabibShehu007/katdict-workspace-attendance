// hooks/performance_hooks/usePerformanceStats.ts
import { useMemo } from "react";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

export function usePerformanceStats(historyLogs: WorkspaceHistoryItem[]) {
  return useMemo(() => {
    if (!historyLogs || historyLogs.length === 0) return null;

    const totalDays = historyLogs.length;

    // We use the camelCase properties defined in your WorkspaceHistoryItem interface
    const avgPunctuality =
      historyLogs.reduce(
        (acc, log) =>
          acc + (log.isLogEmpty || !log.isOnSite ? 0 : !log.isLate ? 100 : 0),
        0,
      ) / totalDays;

    const avgCompletion =
      historyLogs.reduce(
        (acc, log) => acc + (log.isLogEmpty || !log.isOnSite ? 0 : 100),
        0,
      ) / totalDays;

    const successfulDays = historyLogs.filter(
      (log) => !log.isLogEmpty && log.isOnSite,
    ).length;

    const consistency = (successfulDays / totalDays) * 100;

    return {
      punctuality: Math.round(avgPunctuality),
      completion: Math.round(avgCompletion),
      consistency: Math.round(consistency),
      overallGrade: Math.round(
        (avgPunctuality + avgCompletion + consistency) / 3,
      ),
      isLocked: new Date().getDay() !== 5, // Keep your Friday lock logic
    };
  }, [historyLogs]);
}
