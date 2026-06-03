import { useMemo } from "react";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

export function usePerformanceStats(historyLogs: WorkspaceHistoryItem[]) {
  return useMemo(() => {
    const now = new Date();
    const isFridayNoon = now.getDay() === 5 && now.getHours() >= 12;

    if (!historyLogs || historyLogs.length === 0) return null;

    // 1. Calculate Daily Breakdown (for your toggler)
    const dailyData = historyLogs.map((log) => ({
      date: log.formatted_date,
      day: log.day_name,
      punctuality: !log.is_late ? 100 : 0,
      completion: !log.is_log_empty ? 100 : 0,
    }));

    // 2. Calculate Weekly Averages
    const total = dailyData.length;
    const avgPunctuality =
      dailyData.reduce((a, b) => a + b.punctuality, 0) / total;
    const avgCompletion =
      dailyData.reduce((a, b) => a + b.completion, 0) / total;
    const consistency =
      (dailyData.filter((s) => s.completion === 100).length / total) * 100;

    const rawGrade = (avgPunctuality + avgCompletion + consistency) / 3;
    const finalGrade = rawGrade === 100 ? 100 : Math.max(90, rawGrade - 5);

    return {
      summary: {
        punctuality: Math.round(avgPunctuality),
        completion: Math.round(avgCompletion),
        consistency: Math.round(consistency),
        overallGrade: isFridayNoon ? Math.round(finalGrade) : null,
        isLocked: !isFridayNoon,
      },
      dailyData, // Now we can toggle through this in the UI!
    };
  }, [historyLogs]);
}
