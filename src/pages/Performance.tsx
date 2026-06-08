import { useState, useMemo } from "react";
import { useWorkspaceHistory } from "../hooks/history_hooks/useWorkspaceHistory";
import { usePerformanceStats } from "../hooks/performance_hooks/usePerformanceStats";
import { PerformanceCard } from "../components/performance/PerformanceCard";
import { PerformanceGauge } from "../components/performance/PerformanceGauge";
import { TechStackChart } from "../components/performance/TechStackChart";
import { HistoryTable } from "../components/performance/HistoryTable";
import { PerformanceToggler } from "../components/performance/PerformanceToggler";
import { PerformanceSkeleton } from "../components/performance/PerformanceSkeleton";
import { PerformanceEmptyState } from "../components/performance/EmptyState"; // Assuming this path
import { Clock, Zap, Target, Award } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Performance() {
  const { historyLogs, isHistoryLoading } = useWorkspaceHistory();
  const stats = usePerformanceStats(historyLogs);
  const [activeView, setActiveView] = useState<"weekly" | string>("weekly");

  // Determine if we have any data to show
  const hasData = historyLogs && historyLogs.length > 0;

  // Find the specific log for the selected day
  const dailyLog = useMemo(() => {
    if (activeView === "weekly") return null;
    return historyLogs.find((log) =>
      log.day_name.toLowerCase().startsWith(activeView.toLowerCase()),
    );
  }, [historyLogs, activeView]);

  const techData = useMemo(() => {
    const logs =
      activeView === "weekly" ? historyLogs : dailyLog ? [dailyLog] : [];
    const counts: Record<string, number> = {};
    let totalEntries = 0;

    logs.forEach((log) => {
      log.tech_stacks?.forEach((stack: string) => {
        counts[stack] = (counts[stack] || 0) + 1;
        totalEntries++;
      });
    });

    return Object.entries(counts).map(([key, count]) => ({
      key,
      value: Math.round((count / (totalEntries || 1)) * 100),
    }));
  }, [historyLogs, dailyLog, activeView]);

  const displayedLogs =
    activeView === "weekly" ? historyLogs : dailyLog ? [dailyLog] : [];

  const data = useMemo(() => {
    if (activeView === "weekly" && stats) return stats;

    if (!dailyLog || dailyLog.is_log_empty || !dailyLog.is_on_site) {
      return {
        punctuality: 0,
        consistency: 0,
        completion: 0,
        overallGrade: 0,
        isLocked: false,
      };
    }

    const punctuality = !dailyLog.is_late ? 100 : 0;
    return {
      punctuality,
      consistency: 100,
      completion: 100,
      overallGrade: Math.round((punctuality + 100 + 100) / 3),
      isLocked: false,
    };
  }, [activeView, stats, dailyLog]);

  // Loading state
  if (isHistoryLoading) {
    return (
      <DashboardLayout>
        <PerformanceSkeleton />
      </DashboardLayout>
    );
  }

  // Empty state for new users
  if (!hasData) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto pt-10 px-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Performance
          </h1>
          <PerformanceEmptyState />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
        <div className="col-span-1 flex flex-col md:flex-row md:items-center justify-between gap-4 md:col-span-12">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Performance
          </h1>
          <PerformanceToggler
            activeView={activeView}
            onToggle={setActiveView}
            isLocked={stats?.isLocked ?? false}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:col-span-3">
          <PerformanceCard
            title="Punctuality"
            value={data.punctuality}
            icon={Clock}
          />
          <PerformanceCard
            title="Consistency"
            value={data.consistency}
            icon={Zap}
          />
          <PerformanceCard
            title="Deliverance"
            value={data.completion}
            icon={Target}
          />
          <PerformanceCard
            title="Grade"
            value={data.overallGrade}
            icon={Award}
          />
        </div>

        <div className="md:col-span-9 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceGauge
              value={data.overallGrade}
              isLocked={
                activeView === "weekly" ? (stats?.isLocked ?? false) : false
              }
            />
            <TechStackChart data={techData} />
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">
              {activeView === "weekly" ? "Weekly Activity" : "Daily Detail"}
            </h2>
            <HistoryTable logs={displayedLogs} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
