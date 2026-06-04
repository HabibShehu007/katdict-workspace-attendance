import { useState } from "react";
import { useWorkspaceHistory } from "../hooks/history_hooks/useWorkspaceHistory";
import { usePerformanceStats } from "../hooks/performance_hooks/usePerformanceStats";
import { PerformanceCard } from "../components/performance/PerformanceCard";
import { PerformanceGauge } from "../components/performance/PerformanceGauge";
import { DonutChart } from "../components/performance/DonutChart";
import { HistoryTable } from "../components/performance/HistoryTable";
import { PerformanceToggler } from "../components/performance/PerformanceToggler";
import { Clock, Zap, Target, Award, Lock } from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Performance() {
  const { historyLogs, isHistoryLoading } = useWorkspaceHistory();
  const stats = usePerformanceStats(historyLogs);
  const [activeView, setActiveView] = useState<"weekly" | number>("weekly");

  if (isHistoryLoading || !stats) return <div className="p-8">Loading...</div>;

  // Logic: Filter logs for the table based on active selection
  const displayedLogs =
    activeView === "weekly"
      ? historyLogs
      : [historyLogs[activeView]].filter(Boolean);

  // Logic: Choose between weekly summary or specific day data for cards
  const data =
    activeView === "weekly"
      ? stats.summary
      : {
          punctuality: stats.dailyData[activeView]?.punctuality || 0,
          consistency: stats.dailyData[activeView]?.consistency || 0,
          completion: stats.dailyData[activeView]?.completion || 0,
          overallGrade: stats.dailyData[activeView]?.grade || 0, // No longer null!
        };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
        <div className="md:col-span-12 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Performance</h1>
          <PerformanceToggler
            activeView={activeView}
            onToggle={setActiveView}
            isLocked={stats.summary.isLocked}
          />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-3 gap-4">
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
            icon={Award} // Remove the isLocked logic here so it's always visible
            isLocked={false}
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PerformanceGauge
              value={data.overallGrade} // Changed from stats.summary.overallGrade
              isLocked={
                activeView === "weekly" ? stats.summary.isLocked : false
              }
            />
            <DonutChart
              data={[
                { label: "On Time", value: data.punctuality, color: "emerald" },
                {
                  label: "Late",
                  value: 100 - (data.punctuality || 0),
                  color: "rose",
                },
              ]}
            />
          </div>

          {/* Dynamic Table Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">
              {activeView === "weekly" ? "Weekly Activity" : "Daily Detail"}
            </h2>
            <HistoryTable logs={displayedLogs} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
