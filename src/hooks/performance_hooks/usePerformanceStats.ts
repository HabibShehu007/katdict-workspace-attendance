// hooks/performance_hooks/usePerformanceStats.ts
import { useMemo } from "react";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

export function usePerformanceStats(historyLogs: WorkspaceHistoryItem[]) {
  return useMemo(() => {
    if (!historyLogs || historyLogs.length === 0) return null;
    const totalDays = historyLogs.length;

    const avgPunctuality =
      historyLogs.reduce(
        (acc, log) =>
          acc +
          (log.is_log_empty || !log.is_on_site ? 0 : !log.is_late ? 100 : 0),
        0,
      ) / totalDays;
    const avgCompletion =
      historyLogs.reduce(
        (acc, log) => acc + (log.is_log_empty || !log.is_on_site ? 0 : 100),
        0,
      ) / totalDays;
    const successfulDays = historyLogs.filter(
      (log) => !log.is_log_empty && log.is_on_site,
    ).length;
    const consistency = (successfulDays / totalDays) * 100;

    return {
      punctuality: Math.round(avgPunctuality),
      completion: Math.round(avgCompletion),
      consistency: Math.round(consistency),
      overallGrade: Math.round(
        (avgPunctuality + avgCompletion + consistency) / 3,
      ),
      isLocked: new Date().getDay() !== 5, // Example lock logic
    };
  }, [historyLogs]);
}
