import { useState, useMemo } from "react";
import { useWorkspaceHistory } from "../hooks/history_hooks/useWorkspaceHistory";
import { usePerformanceStats } from "../hooks/performance_hooks/usePerformanceStats";
import { PerformanceCard } from "../components/performance/PerformanceCard";
import { PerformanceGauge } from "../components/performance/PerformanceGauge";
import { TechStackChart } from "../components/performance/TechStackChart";
import { HistoryTable } from "../components/performance/HistoryTable";
import { PerformanceToggler } from "../components/performance/PerformanceToggler";
import { Clock, Zap, Target, Award } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Performance() {
  const { historyLogs, isHistoryLoading } = useWorkspaceHistory();
  const stats = usePerformanceStats(historyLogs);
  const [activeView, setActiveView] = useState<"weekly" | number>("weekly");

  // 1. Data Aggregation for Tech Stack Chart
  const techData = useMemo(() => {
    if (!historyLogs) return [];

    const logs =
      activeView === "weekly"
        ? historyLogs
        : [historyLogs[activeView]].filter(Boolean);

    const counts: Record<string, number> = {};
    let totalEntries = 0;

    logs.forEach((log) => {
      // FIX: Changed 'used_stacks' to 'tech_stacks' to match your interface
      log.tech_stacks?.forEach((stack: string) => {
        counts[stack] = (counts[stack] || 0) + 1;
        totalEntries++;
      });
    });

    return Object.entries(counts).map(([key, count]) => ({
      key,
      value: Math.round((count / (totalEntries || 1)) * 100), // Added division by 1 to prevent NaN
    }));
  }, [historyLogs, activeView]);

  if (isHistoryLoading || !stats) return <div className="p-8">Loading...</div>;

  // 2. Logic: Filter logs for the table
  const displayedLogs =
    activeView === "weekly"
      ? historyLogs
      : [historyLogs[activeView]].filter(Boolean);

  // 3. Logic: Choose between weekly summary or specific day data
  const data =
    activeView === "weekly"
      ? stats.summary
      : {
          punctuality: stats.dailyData[activeView]?.punctuality || 0,
          consistency: stats.dailyData[activeView]?.consistency || 0,
          completion: stats.dailyData[activeView]?.completion || 0,
          overallGrade: stats.dailyData[activeView]?.grade || 0,
        };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
        {/* Header - Changed to flex-col on mobile, flex-row on desktop */}
        <div className="col-span-1 flex flex-col md:flex-row md:items-center justify-between gap-4 md:col-span-12">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Performance
          </h1>
          <PerformanceToggler
            activeView={activeView}
            onToggle={setActiveView}
            isLocked={stats.summary.isLocked}
          />
        </div>

        {/* Metric Cards - Stacked on mobile, 3 wide on desktop */}
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
            isLocked={false}
          />
        </div>

        <div className="md:col-span-9 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceGauge
              value={data.overallGrade}
              isLocked={
                activeView === "weekly" ? stats.summary.isLocked : false
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
