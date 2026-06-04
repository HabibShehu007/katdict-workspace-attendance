import { useMemo } from "react";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

export function usePerformanceStats(historyLogs: WorkspaceHistoryItem[]) {
  return useMemo(() => {
    const now = new Date();
    const isFridayNoon = now.getDay() === 5 && now.getHours() >= 12;

    if (!historyLogs || historyLogs.length === 0) return null;

    const dailyData = historyLogs.map((log) => {
      const isAbsentOrBlocked = log.is_log_empty || !log.is_on_site;

      const punctuality = isAbsentOrBlocked ? 0 : !log.is_late ? 100 : 0;
      const completion = isAbsentOrBlocked ? 0 : 100;
      // Daily consistency is 100 if completed, else 0
      const consistency = isAbsentOrBlocked ? 0 : 100;

      // Calculate grade for this specific day
      const dailyGrade = Math.round(
        (punctuality + completion + consistency) / 3,
      );

      return {
        date: log.formatted_date,
        day: log.day_name,
        punctuality,
        completion,
        consistency,
        grade: dailyGrade, // Now accessible per day!
      };
    });

    // Calculate Weekly Averages
    const totalDays = dailyData.length;
    const avgPunctuality =
      dailyData.reduce((a, b) => a + b.punctuality, 0) / totalDays;
    const avgCompletion =
      dailyData.reduce((a, b) => a + b.completion, 0) / totalDays;
    const successfulDays = dailyData.filter((s) => s.completion === 100).length;
    const consistency = (successfulDays / totalDays) * 100;

    const rawGrade = (avgPunctuality + avgCompletion + consistency) / 3;
    const finalGrade = Math.min(100, Math.max(0, rawGrade));

    return {
      summary: {
        punctuality: Math.round(avgPunctuality),
        completion: Math.round(avgCompletion),
        consistency: Math.round(consistency),
        overallGrade: isFridayNoon ? Math.round(finalGrade) : null,
        isLocked: !isFridayNoon,
      },
      dailyData,
    };
  }, [historyLogs]);
}
